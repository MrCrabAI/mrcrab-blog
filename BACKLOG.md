# 需求池 · Backlog

待办的改进项。按优先级排列;每项记录**做什么 / 为什么 / 成本 / 收益 / 注意点**,
便于冷启动直接动手。状态:🔲 待办 · 🔄 进行中 · ✅ 完成。

---

## 🔲 1. 迁移托管到 Cloudflare Pages

**做什么**
把当前部署从 Netlify 迁到 Cloudflare Pages(可先并存,再决定是否下线 Netlify)。

**为什么**
- 免费版**带宽 / 请求不限量**(Netlify 免费版 100GB/月,超额很贵)——给流量增长上保险。
- CDN 节点更多(330+ 城市),亚洲访问更快。
- 中国大陆访问比 Netlify 略好(但**两者都不是"快"**;真要快需 ICP 备案 + 国内 CDN)。

**成本**
- 迁移工作量**极低**:构建不变(`npm run build` → `dist`),base 已是根路径,**不改代码**。
- 在 Cloudflare 控制台连 GitHub repo 即可,流程与 Netlify 一致。

**注意点 / 决策**
- 这是"锦上添花 + 上保险",不是解决当前痛点;现状 Netlify 完全够用。
- 若读者主要在大陆,换 Cloudflare 解决不了根本问题(需备案 + 国内 CDN)。
- 迁完记得决定 Netlify 站是保留(冗余)还是下线(避免两套 CI 跑同一 repo)。

---

## 🔲 2. 集成 Giscus 评论

**做什么**
在文章页接入 [Giscus](https://giscus.app/)(基于 GitHub Discussions 的评论组件)。

**为什么**
- repo 已公开,Giscus **零后端、免费、无广告**,与 GitHub 天然契合。
- 避免自建评论后端(建表 / API / 反垃圾 / 审核)的长期维护负担。

**成本**
- 低:repo 开启 **Discussions** → 安装 giscus app → 在 `[slug].astro` 加一个 `<script>` 嵌入块(读 data-theme 联动深色模式)。
- 约半天内可完成。

**注意点 / 决策(重要)**
- ⚠️ **读者必须有 GitHub 账号并登录才能评论** —— 对中文大众读者门槛偏高。
- 若希望"**任何人无需登录就能评论**",Giscus 不合适,应改走
  **Cloudflare 原生方案**(Workers + D1 + Turnstile,需自建,见下方"未来考虑")。
- 决策点:**你的读者是否接受 GitHub 登录?** 接受 → Giscus;不接受 → D1 自建。

---

## 未来考虑(暂不排期)

- **真实点赞 / 收藏 / 浏览量**:当前点赞数是随机假值、收藏是内存态(刷新即丢)。
  做真实持久化需"静态 + 少量 serverless"中间路线(Workers + D1)。
- **无登录评论**:若否决 Giscus,用 Cloudflare Workers + D1 + Turnstile 自建。
- **网页后台写作**:若不想再改 markdown + git,可接 Headless CMS(如 Decap/Sveltia),
  仍保留静态构建,避免上完整后端。
- **自定义域名 + ICP 备案 + 国内 CDN**:仅当确认要服务中国大陆读者时才值得。
- **替换占位图**:文章 hero 目前用 `picsum.photos` 占位,换成自有图。
  - 默认方案:**Astro 本地图片优化**(图进 repo + `image()` schema + `<Image>`,
    构建时自动压缩 / WebP/AVIF / 多尺寸,免费零依赖)。
  - 后备:repo 体积变大、或想"不 commit 就上传"时再迁 **Cloudflare R2**。
  - 取舍:本地方案换图要 commit + 重新构建;要"传完即用"才需 R2/图床。

---

## 参考 · 商业托管方案调研(若哪天不想再自维护)

**核心取舍:越"什么都不用管",越要放弃现在这套 bespoke 精美设计。**
当前自维护成本其实已接近于零(写完 `git push` 即部署),补上 Giscus + 本地图就齐活。
仅当抵触的是"git/markdown 写作流"或"彻底不想碰技术"时才考虑迁移。

按"最看重什么"选:
- **零运维 + 保留高级感 + 拥有域名/数据** → **Ghost (Pro)**(~$9–25/月,
  评论/订阅/会员/图全内置,主题可改,气质最接近现状)。
- **靠写作做内容 + 要订阅/变现 + 不在乎样式雷同** → **Substack**(免费,抽成)。
- **可视化拖拽、完全不碰代码** → **Squarespace**(~$16+/月)。
- **想保留这套设计但要"网页后台写作、不碰 git"** → 接 **Headless CMS**
  (Decap/Sveltia 等,仍出静态构建)——不必整站迁走。
- **读者主要在中国大陆、要的是有人看** → **微信公众号**(但等于放弃独立站 + 自定义设计)。

其余了解过的:Bear Blog/Mataroa(极简)、Wix/Webflow、WordPress.com、Medium、
Notion + Super.so。对本项目多为"杀鸡用牛刀"或丢失设计,优先级低。

**决策点:抵触的是"怕维护出问题"还是"不想再碰 git/代码"?**
前者 → 不必迁,补 Giscus + 本地图即可;后者 → Headless CMS 或 Ghost。
