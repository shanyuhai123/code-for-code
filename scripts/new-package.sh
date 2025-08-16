#!/usr/bin/env bash
set -e

# 检查参数
if [ -z "$1" ]; then
  echo "❌ 请输入包名，例如: ./scripts/new-package.sh @vue/reactivity"
  exit 1
fi

PKG_NAME="$1"

# 解析 scope 和真实目录
if [[ "$PKG_NAME" == @*/* ]]; then
  # scoped 包，例如 @vue/reactivity
  SCOPE=$(echo "$PKG_NAME" | cut -d/ -f1)
  NAME=$(echo "$PKG_NAME" | cut -d/ -f2)
  DIR="packages/$SCOPE/$NAME"
else
  # 非 scoped 包
  DIR="packages/$PKG_NAME"
fi

# 创建目录
mkdir -p "$DIR"
cd "$DIR"

# 初始化 package.json
pnpm init >/dev/null

# 设置包名
pnpm pkg set name="$PKG_NAME"

echo "✅ 已创建 workspace 包: $PKG_NAME"
echo "📦 位置: $DIR"
