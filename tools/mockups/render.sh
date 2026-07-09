#!/bin/zsh
# 把某篇博文的终端配图 HTML 渲染成 2x 高清 PNG，直接落到 public/assets/<slug>/。
#
# 用法：
#   zsh tools/mockups/render.sh <slug>        # 渲染 tools/mockups/<slug>/*.html
#   zsh tools/mockups/render.sh <slug> --open # 渲染完在 Finder 里打开输出目录
#
# 约定：
#   - 源文件放在   tools/mockups/<slug>/*.html
#   - 共用样式是   tools/mockups/term.css （HTML 里用 href="../term.css" 引它）
#   - 每个 HTML 的 <head> 里写一行  <meta name="shot" content="宽x高">  声明画布尺寸；
#     不写则用默认 1180x680。改文案后尺寸不合适，改这一行即可。
#   - 输出到       public/assets/<slug>/<同名>.png ，写进博文直接用 /assets/<slug>/xx.png
#
# 依赖：macOS + Google Chrome（其它平台改下面 CHROME 变量指向你的 Chrome/Chromium）。
#
# 看门狗说明：本环境的无头 Chrome 有个怪癖——截图已经写好，进程却不退出。
# 所以这里不等 Chrome 自己结束，而是盯着输出文件：PNG 落盘、>10KB、且大小
# 两次检查不再变化（写完了）→ 立刻 kill。

set -u

SLUG="${1:-}"
if [ -z "$SLUG" ]; then
  echo "用法：zsh tools/mockups/render.sh <slug> [--open]"
  echo "例：  zsh tools/mockups/render.sh claude-code-guide"
  exit 1
fi

# 目录锚点，脚本搬到哪都能跑：MOCK=tools/mockups，REPO=仓库根
MOCK="${0:A:h}"
REPO="${MOCK:h:h}"
SRC="$MOCK/$SLUG"
OUT="$REPO/public/assets/$SLUG"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

if [ ! -d "$SRC" ]; then
  echo "找不到源目录：$SRC"
  echo "把这篇博文的 *.html 放进 tools/mockups/$SLUG/ 再跑。"
  exit 1
fi
if [ ! -x "$CHROME" ]; then
  echo "找不到 Chrome：$CHROME"
  echo "请安装 Google Chrome，或修改脚本顶部的 CHROME 变量指向你的浏览器。"
  exit 1
fi

mkdir -p "$OUT"

shot() {
  local file=$1 name=$2 w=$3 h=$4
  local out="$OUT/$name.png"
  rm -f "$out"
  "$CHROME" --headless --no-sandbox --disable-gpu --hide-scrollbars \
    --force-device-scale-factor=2 --disable-crash-reporter --disable-breakpad \
    --user-data-dir="$MOCK/.chrome-$name" --no-first-run --disable-extensions --disable-sync \
    --virtual-time-budget=2000 --timeout=10000 \
    --window-size=$w,$h --screenshot="$out" "file://$file" >/dev/null 2>&1 &
  local pid=$!
  local i=0 last=-1
  while [ $i -lt 60 ]; do
    if [ -f "$out" ]; then
      local sz=$(stat -f%z "$out" 2>/dev/null || echo 0)
      if [ "$sz" -gt 10000 ] && [ "$sz" = "$last" ]; then break; fi
      last=$sz
    fi
    if ! kill -0 $pid 2>/dev/null; then break; fi
    sleep 0.5; i=$((i+1))
  done
  kill -9 $pid 2>/dev/null
  wait $pid 2>/dev/null
  if [ -f "$out" ]; then echo "OK  $name ($(stat -f%z "$out") bytes)  ${w}x${h}"; else echo "FAIL $name"; fi
}

total=0
for file in "$SRC"/*.html(N); do
  name="${file:t:r}"                       # 文件名去扩展名
  # 从 <meta name="shot" content="WxH"> 读画布尺寸，读不到用默认
  size=$(grep -o 'name="shot" content="[0-9]*x[0-9]*"' "$file" | grep -o '[0-9]*x[0-9]*' | head -1)
  w="${size%x*}"; h="${size#*x}"
  [ -z "$w" ] && w=1180
  [ -z "$h" ] && h=680
  shot "$file" "$name" "$w" "$h"
  total=$((total+1))
done

# 清理残留 helper 进程与临时 profile
pgrep -f "$MOCK/.chrome" | xargs kill -9 2>/dev/null
rm -rf "$MOCK"/.chrome*

made=$(ls "$OUT" 2>/dev/null | grep -c '\.png$')
echo "=== DONE $made/$total → public/assets/$SLUG/ ==="

if [ "${2:-}" = "--open" ]; then open "$OUT"; fi
