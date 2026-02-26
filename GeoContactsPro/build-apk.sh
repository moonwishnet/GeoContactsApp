#!/bin/bash
# GeoContacts+ Pro APK 构建脚本

set -e

echo "=========================================="
echo "  GeoContacts+ Pro APK 构建脚本"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 检查 Node.js
echo "[1/5] 检查 Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}错误: 未找到 Node.js${NC}"
    echo "请先安装 Node.js 18+: https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}错误: Node.js 版本过低 (需要 18+)${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version)${NC}"

# 安装依赖
echo ""
echo "[2/5] 安装依赖..."
if [ -d "node_modules" ]; then
    echo "依赖已安装"
else
    npm install
    echo -e "${GREEN}✓ 依赖安装完成${NC}"
fi

# 检查 EAS CLI
echo ""
echo "[3/5] 检查 EAS CLI..."
if ! command -v eas &> /dev/null; then
    echo "安装 EAS CLI..."
    npm install -g eas-cli
fi
echo -e "${GREEN}✓ EAS CLI 已就绪${NC}"

# 登录检查
echo ""
echo "[4/5] 检查 Expo 登录状态..."
if ! eas whoami &> /dev/null; then
    echo -e "${YELLOW}需要登录 Expo 账号${NC}"
    echo "请在浏览器中完成登录，或按提示输入账号密码"
    echo ""
    echo "如果没有账号，免费注册: https://expo.dev/signup"
    echo ""
    eas login
fi
echo -e "${GREEN}✓ 已登录 Expo${NC}"

# 开始构建
echo ""
echo "=========================================="
echo "  开始构建 APK..."
echo "=========================================="
echo ""
echo -e "${YELLOW}提示: 首次构建约需 15-20 分钟${NC}"
echo -e "${YELLOW}构建完成后会收到邮件通知${NC}"
echo ""

# 执行构建
eas build -p android --profile preview

echo ""
echo "=========================================="
echo -e "${GREEN}  构建命令已提交!${NC}"
echo "=========================================="
echo ""
echo "构建完成后:"
echo "1. 检查邮箱获取下载链接"
echo "2. 或访问: https://expo.dev/accounts/[你的账号]/projects"
echo ""
echo "查看构建状态:"
echo "  eas build:list"
echo ""
