# tools/mockups — 终端配图工具

给博文画「终端截图」用的一套自制工具：用 HTML + CSS 逐像素复刻 Claude Code 之类的
终端界面，再用无头 Chrome 渲染成 2x 高清 PNG。比真机截屏可控（文案、版本号、配色随便改），
也不用担心泄露真实环境。

## 目录

```
tools/mockups/
  term.css              # 共用的终端外壳样式（窗口、标题栏、配色、语法高亮 class）
  render.sh             # 出图脚本：HTML → public/assets/<slug>/*.png
  <slug>/               # 每篇博文一个文件夹，放这篇的 *.html
    00-hero.html
    01-xxx.html
    ...
  claude-code-guide/    # 已有的一整套，可当模板照抄
```

## 出图

```bash
zsh tools/mockups/render.sh <slug>          # 渲染 tools/mockups/<slug>/*.html
zsh tools/mockups/render.sh <slug> --open   # 渲染完顺手在 Finder 打开输出目录
```

输出直接落到 `public/assets/<slug>/`，博文里用 `/assets/<slug>/xx.png` 引用即可。
依赖：macOS + Google Chrome（其它平台改 `render.sh` 顶部的 `CHROME` 变量）。

## 下次写博客怎么加图

1. 新建 `tools/mockups/<你的-slug>/`，把每张图写成一个 `.html`。
2. 每个 HTML 复用共用样式，`<head>` 里这样起头（注意 `../term.css` 指向上一级）：

   ```html
   <!doctype html><html><head>
     <meta charset="utf-8">
     <meta name="shot" content="1180x680">   <!-- 画布尺寸：宽x高，render.sh 读这行 -->
     <link rel="stylesheet" href="../term.css">
   </head><body>
     <div class="window"> … </div>
     <div class="brand">MrCrabAI</div>
   </body></html>
   ```

   - 不写 `<meta name="shot">` 就用默认 `1180x680`；图裁不下就把这行宽高调大。
   - 封面这类不套终端窗口的图，可以像 `claude-code-guide/00-hero.html` 那样内联自己的 `<style>`。
3. `zsh tools/mockups/render.sh <你的-slug>`，然后在 Markdown 里 `![](/assets/<你的-slug>/xx.png)`。

## term.css 里常用的 class

- `.window / .titlebar / .dots .dot(.r/.y/.g) / .title / .term` — 终端窗口外壳
- `.line`（一行，`white-space:pre-wrap`）
- 文本色：`.dim .dimmer .orange .user .b(加粗) .tooldot(绿点) .ok(绿) .errx(红)`
- `.brand` — 右下角水印

配色和字体在 `term.css` 顶部，改一处全套图统一。
