---
date: 2026-07-07
tag: guide
readMin: 15
article: true
titleCn: "Claude Code 使用指南"
titleEn: "The Claude Code Guide"
dekCn: "从第一行命令到进阶工作流——把 AI 真正用进开发流程。"
dekEn: "From your first command to advanced workflows."
hero: "/assets/claude-code-guide/00-hero.png"
---

> 写给想把 AI 真正用进开发流程的人。读完这篇你可以：把它装起来跑通第一个任务、看懂权限与四种模式、用命令和记忆系统把它调教成老搭档，再进阶到子智能体、MCP 和 CI 自动化。本文基于 2026 年 7 月的 Claude Code v2.1.x，示例项目是我正在做的开源可视化 [ai-money-map](https://aimoneymap.mrcrabai.com)。

## 一、Claude Code 是什么，和补全工具有什么不一样

Claude Code 是 Anthropic 官方出品、跑在**终端里**的 AI 编程智能体（agentic coding tool）。注意关键词是「智能体」而不是「补全」：

- **补全工具**（Copilot 式）的单位是"一行代码"：你写，它猜下一行。
- **Claude Code** 的单位是"一件事"：你说"把这个 bug 修了、测试跑绿"，它自己去读代码、改文件、跑命令、看报错、再改，直到干完向你汇报。

它的能力来自一组内置工具：读写文件、全库搜索、执行 shell 命令、操作 git、联网查资料，以及通过 MCP 接入你给它的任何外部工具。整个过程你坐在批准席上——每一个写操作默认都要经你点头（后面会讲怎么调节这个"松紧度"）。

**形态**：本体是 CLI（本文主角），另有 VS Code / JetBrains 插件、桌面 App、网页版（claude.ai/code）和 GitHub Action。CLI 学会了，其他形态都是换壳。

**适合谁**：会用终端的开发者是主力用户；但只要你的活儿能表达成"对一堆文件做一系列操作"——写脚本、整理数据、批量改文档——它同样好使。

## 二、安装与登录（5 分钟）

系统要求：macOS / Linux / Windows（已原生支持，不再需要 WSL；早年"Windows 必须装 WSL"的教程已过时）。

**方式一：原生安装器（推荐，不依赖 Node）**

```bash
# macOS / Linux
curl -fsSL https://claude.ai/install.sh | bash

# Windows PowerShell
irm https://claude.ai/install.ps1 | iex
```

**方式二：npm（需要 Node 18+）**

```bash
npm install -g @anthropic-ai/claude-code
```

装好后，进到任意项目目录里启动：

```bash
cd 你的项目
claude
```

首次运行会弹浏览器让你登录，两种付费通道二选一：

1. **Claude 订阅**（Pro / Max）——包月用量，个人用户首选；
2. **Anthropic Console API**——按 token 计费，适合重度使用和自动化。

登录成功、确认信任当前目录后，你会看到这个界面：

![Claude Code 首次启动界面](/assets/claude-code-guide/01-welcome.png)

*▲ 首次启动：左边是版本与模型，下面是官方给新手的三条建议——第一条就是运行 `/init`，后文细说。*

日常维护只需要记两条：`claude update` 手动升级（默认也会自动更新），`/doctor` 自检安装与配置问题。在 VS Code 的集成终端里跑 `claude` 会自动装好 IDE 联动（diff 在编辑器里展示）。

## 三、10 分钟上手：第一个任务

不需要学任何语法，直接说人话，像给同事派活一样——**带上下文、带验收标准**：

![一次完整的小任务](/assets/claude-code-guide/02-first-task.png)

*▲ 一次真实的工作循环：读实现 → 写测试 → 跑测试 → 测试抓出真 bug → 修复 → 复跑全绿。注意我在指令里说了"跑通为止"，它就真的会跑通为止。*

这张图浓缩了 Claude Code 的核心工作循环：**读 → 改 → 跑 → 看结果 → 再改**。你要做的只有两件事：把需求说清楚，以及在它请求权限时把关。

几个上手必知的小操作：

- **`@` 引用文件**：输入 `@` 会弹出文件补全，精确告诉它看哪个文件，比"你自己找找"省时省 token。
- **贴图**：直接把截图粘贴进对话（macOS 注意是 **Ctrl+V 不是 Cmd+V**，几乎人人踩一次这个坑）。报错截图、设计稿都能看懂。
- **Esc 打断**：发现它跑偏，立刻 Esc，别客气，也别等它把坑挖完。
- **双击 Esc 或 `/rewind`**：打开回退面板。Claude Code 会在每次改代码前自动打"检查点"，对话和代码都能回退到任意一步——相当于 git 之外多了一层后悔药（注意：只回退文件修改，shell 命令的副作用不在保护范围）。

## 四、权限与四种模式：松紧度自己调

Claude Code 的安全模型是"行动前请示"。按 **Shift+Tab** 可以在模式间循环切换，四档从紧到松：

| 模式 | 行为 | 适用场景 |
|---|---|---|
| **默认** | 每个写操作、每条 shell 命令逐一请求批准 | 新项目、不熟悉的库、生产相关 |
| **Accept Edits** | 文件编辑自动放行，命令仍需批准 | 你已进入状态、任务边界清晰 |
| **Plan Mode** | 只读研究，不动任何文件，先产出计划 | 大改动、重构、动架构之前 |
| **Bypass Permissions** | 全部放行（`--dangerously-skip-permissions`） | 只建议在容器/一次性环境里用 |

重点推荐 **Plan Mode**：大改动之前先切过去（Shift+Tab 两下），让它把方案研究明白、列出来，你批了它才动手。方案里的问题在这一步纠正，成本是最低的：

![Plan 模式](/assets/claude-code-guide/03-plan-mode.png)

*▲ Plan 模式下它只读不写，研究完给出分步计划；右下角的状态标记表明当前处于 plan mode。批准后可以直接选"自动接受编辑"一口气干完。*

两个配套设施：

- **`/permissions` 白名单**：把你信任的操作（比如 `npm test`、`git commit`）加进 allow 列表，以后不再弹窗。规则存在 `.claude/settings.json`，可以随仓库提交给全队共享。
- **沙箱**：v2 起 bash 命令默认跑在操作系统级沙箱里（文件与网络隔离），越界会显式请求，这让"少弹窗"和"安全"可以兼得。

## 五、斜杠命令与快捷键速查

输入 `/` 即可唤出命令菜单：

![斜杠命令菜单](/assets/claude-code-guide/04-slash-menu.png)

高频命令一张表（全部命令看 `/help`）：

| 命令 | 干什么 |
|---|---|
| `/init` | 扫描代码库，生成 CLAUDE.md 项目说明（新项目第一件事） |
| `/clear` | 清空上下文，开始新任务（**换任务必用**） |
| `/compact` | 压缩历史为摘要，腾出上下文但保留脉络 |
| `/context` | 可视化当前上下文占用（彩色格子图） |
| `/model` | 切换模型（Opus / Sonnet / Haiku 档位） |
| `/resume` | 恢复历史会话（终端关了也能接着聊） |
| `/rewind` | 回退对话/代码到某个检查点 |
| `/memory` | 编辑记忆文件（CLAUDE.md） |
| `/permissions` | 管理工具白名单/黑名单 |
| `/agents` | 管理子智能体 |
| `/mcp` | 管理 MCP 服务器与授权 |
| `/usage` | 订阅用户看额度窗口 |
| `/cost` | API 用户看本次会话花费 |
| `/doctor` | 诊断安装与配置 |

快捷键与输入技巧：

| 按键 | 作用 |
|---|---|
| `Esc` | 打断当前动作 |
| `Esc` ×2 | 回退面板（检查点） |
| `Shift+Tab` | 循环权限模式 |
| `Tab` | 开/关扩展思考（难题打开，简单任务省着点） |
| `!` 开头 | Bash 模式：命令直接进终端跑，结果计入上下文 |
| `#` 开头 | 一句话写入记忆（见下节） |
| `@` | 文件/目录引用补全 |
| `↑` / `↓` | 翻输入历史（跨会话） |
| `Ctrl+O` | 展开被折叠的详细输出 |
| `Ctrl+B` | 把正在跑的长命令挪到后台 |
| `Ctrl+V` | 粘贴剪贴板图片（macOS 别按 Cmd+V） |
| `\` + 回车 | 换行（iTerm2/VS Code 可用 `/terminal-setup` 配成 Shift+Enter） |

## 六、CLAUDE.md：给项目装"长期记忆"

每次新会话，Claude 对你的项目一无所知——除非你把"它该知道的事"写进 **CLAUDE.md**。这个文件会在会话开始时自动进入上下文，相当于新同事入职手册。

在项目根目录跑 `/init`，它会扫描代码库生成一份初稿。之后持续维护，该写的是**从代码里读不出来的东西**：

```markdown
# my-project

## 常用命令
- npm run dev / npm test / npm run build

## 约定
- TS strict；文件 ≤300 行；禁止新增运行时依赖（先写 ADR）
- 提交格式：feat: / fix: / data:（数据改动必须带来源 URL）

## 红线
- 金额保留披露原文口径，不擅自换算
- 免责声明不可移除
```

对话中发现值得沉淀的规则，用 `#` 开头一句话即存，不用打开编辑器：

![用 # 快速写入记忆](/assets/claude-code-guide/06-memory.png)

*▲ `#` 开头的输入会问你存到哪：项目级（随 git 提交、全队共享）、项目本地（gitignore）、还是用户级（`~/.claude/CLAUDE.md`，跨项目生效）。*

三层记忆的定位：**用户级**放个人偏好（比如"回答用中文"），**项目级**放团队约定，**目录级**（子目录里再放 CLAUDE.md）放模块特有规则。原则只有一条：**保持精简**。CLAUDE.md 每次会话都占上下文，写成百科全书反而稀释注意力——它是提示词，不是文档。

## 七、进阶：子智能体、Skills、Hooks、MCP

### 复杂任务：看它自己列 TODO

任务一复杂，它会自动拆解成清单、边干边勾，你随时能看到进度和剩余步骤：

![TODO 清单推进复杂任务](/assets/claude-code-guide/05-todos.png)

### 子智能体（Subagents）

`/agents` 可以创建带独立提示词、独立上下文、独立工具权限的"分身"。两个经典用法：

- **code-reviewer**：写完让"评审员"用挑剔人设过一遍 diff，主对话上下文不被污染；
- **并行探索**：让多个子智能体同时搜代码库的不同角落，结论汇总回主线。

定义就是一个 markdown 文件（`.claude/agents/code-reviewer.md`），可提交进仓库全队共用。

### 自定义命令与 Skills

- **自定义斜杠命令**：把常用提示词存成 `.claude/commands/deploy-check.md`，以后输 `/deploy-check` 一键触发，支持 `$ARGUMENTS` 传参。
- **Skills**：放在 `.claude/skills/` 的"技能包"（说明书 + 可选脚本），不用手动调用——Claude 判断任务匹配时**自动加载**。适合沉淀"怎么做某类事"的完整流程，比如"我司的发版规程"。

### Hooks：确定性的强制约束

提示词是"建议"，Hook 是"必然"。在 `/hooks` 里配置生命周期钩子，比如每次文件编辑后强制跑格式化：

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{ "type": "command", "command": "npx prettier --write \"$CLAUDE_FILE_PATHS\"" }]
    }]
  }
}
```

从此不存在"它忘了格式化"——不依赖模型自觉的事，都该下沉到 Hook。

### MCP：把外部世界接进来

MCP（Model Context Protocol）是给 AI 接工具的开放标准。接上之后，Claude Code 能操作浏览器、查数据库、读 Figma、发消息——生态里现成的服务器数以千计：

```bash
# 例：接入 Playwright，让它能开浏览器自测网页
claude mcp add playwright -- npx @playwright/mcp@latest

# 例：接入 GitHub 官方 MCP（HTTP 方式）
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
```

项目根目录的 `.mcp.json` 可以把配置提交进仓库，全队 clone 下来即用；`/mcp` 查看连接状态、完成 OAuth 授权。我自己最常用的组合：Playwright（改完前端自己开浏览器验收）+ GitHub（读 issue、开 PR 不出终端）。

## 八、自动化：无头模式与 CI，让它自己上班

交互模式之外，`claude -p`（print mode）把它变成一个**能思考的 Unix 命令**——进标准输入，出标准输出，能进管道：

![无头模式](/assets/claude-code-guide/07-headless.png)

*▲ 无头模式三连：数据质检、生成提交信息、结构化输出接 jq。第二条我真的天天在用。*

```bash
# 单发提问，输出完就退出
claude -p "找出 src/ 里所有没有错误处理的 fetch 调用"

# 吃管道
cat error.log | claude -p "分析这份日志，给出最可能的三个原因"

# 结构化输出，接进脚本
claude -p --output-format json "..." | jq -r .result

# 接着上次的会话继续
claude -c -p "把刚才的结论写成 issue 描述"
```

再往上一层是 **GitHub Actions**：交互模式里跑 `/install-github-app`，之后在 issue 或 PR 里 `@claude` 提需求，它在 CI 容器里干活、提交 PR 回来——真正意义上的"云端同事"。要做更复杂的自动化产品，可以直接上 **Claude Agent SDK**（Claude Code 同款引擎的库形态），这里不展开。

## 九、老司机的 10 条经验（含避坑）

1. **上下文是命门。** 一个任务一个会话，干完就 `/clear`。长对话里塞满无关历史，模型准确率肉眼可见地下降——绝大多数"越用越笨"都是这个原因。
2. **具体 > 模糊。** "修一下登录 bug"不如"登录后刷新会跳回登录页，复现步骤是 X，期望行为是 Y，改完跑 `npm test` 验证"。你怎么给人类同事写工单，就怎么给它派活。
3. **重要改动先 Plan。** Shift+Tab 进 Plan Mode，方案批准了再动手。纠正一份计划比纠正三百行 diff 便宜得多。
4. **给它自检的抓手。** 测试、类型检查、lint——它能自己跑的验证手段越多，自我纠错的飞轮转得越好，你介入得越少。这是回报率最高的一条。
5. **小步走，勤提交。** 让它每完成一个独立小块就 commit，git 永远是最硬的后悔药，`/rewind` 只是补充。
6. **跑偏立刻 Esc。** 打断 + 补一句澄清，远比事后收拾半成品省钱省时。
7. **把重复劳动沉淀成资产。** 说过三遍的规则 → `#` 存进 CLAUDE.md；每周都做的流程 → 自定义命令或 Skill；必须强制的约束 → Hook。团队里最强那个人的工作流，从此人人可复用。
8. **`.claude/` 目录进版本控制。** 命令、子智能体、hooks、权限白名单都是团队资产，不是个人配置。
9. **看着点用量。** 订阅额度按 5 小时滚动窗口 + 每周上限计（`/usage` 查看）；API 用户用 `/cost`。日常任务用 Sonnet 档完全够，别默认开着最贵的模型烧简单活。
10. **Bypass 模式只进容器。** `--dangerously-skip-permissions` 很爽，但请只在 Docker/一次性环境里爽——它可以不问你就执行任何命令，名字里的 dangerously 是认真的。

## 十、价格与选择建议

| 通道 | 价格 | 适合 |
|---|---|---|
| Claude Pro | $20/月 | 轻中度使用，小项目日常够用 |
| Claude Max 5x | $100/月 | 每天重度使用的开发者 |
| Claude Max 20x | $200/月 | 全天候多开、跑并行任务 |
| API 按量 | 按 token 计费 | 自动化、CI、用量弹性大 |

订阅制的心智负担最小（不怕"聊一句多少钱"），API 适合无头模式和 CI 场景。模型上，日常主力用 Sonnet 档，难题上 Opus 档乃至 Claude 5 系新旗舰，批量轻活切 Haiku——`/model` 里看你账号实际可选的列表即可，不必记版本号。价格与限额随时会调，以官网 [claude.com/pricing](https://claude.com/pricing) 为准。

## 结语

Claude Code 的学习曲线其实就三级台阶：**会派活**（第三节）→ **会调松紧**（四、五节）→ **会沉淀**（六、七节）。第三级才是分水岭：当你的约定进了 CLAUDE.md、流程进了命令和 Hook、外部工具接上了 MCP，它就从"一个很强的工具"变成"一个越用越懂你的同事"。

延伸阅读：

- 官方文档：[code.claude.com/docs](https://code.claude.com/docs)
- Anthropic 官方最佳实践：[anthropic.com/engineering/claude-code-best-practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- GitHub（发 issue / 看 changelog）：[github.com/anthropics/claude-code](https://github.com/anthropics/claude-code)

---

*本文写于 2026-07，基于 Claude Code v2.1.201。这个工具的迭代速度以周计，细节若与你手头版本不符，以 `/help` 和官方文档为准。*
