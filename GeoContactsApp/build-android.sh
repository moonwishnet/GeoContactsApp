#!/bin/bash

# GeoContacts+ Android 构建脚本

echo "================================"
echo "GeoContacts+ Android 构建脚本"
echo "================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "错误: 未找到 Node.js，请先安装 Node.js 18+"
    exit 1
fi

echo "Node.js 版本: $(node --version)"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "错误: 未找到 npm"
    exit 1
fi

echo ""
echo "步骤 1: 安装依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "错误: 依赖安装失败"
    exit 1
fi

echo ""
echo "步骤 2: 检查 EAS CLI..."
if ! command -v eas &> /dev/null; then
    echo "安装 EAS CLI..."
    npm install -g eas-cli
fi

echo ""
echo "步骤 3: 登录 Expo 账号..."
eas login

echo ""
echo "步骤 4: 配置项目..."
eas build:configure

echo ""
echo "步骤 5: 构建 APK..."
echo "选择以下选项:"
echo "- 平台: Android"
echo "- 配置: preview (生成 APK)"
echo ""
eas build -p android --profile preview

echo ""
echo "================================"
echo "构建完成!"
echo "================================"
echo ""
echo "APK 文件将在构建完成后提供下载链接"
echo "您也可以通过以下命令查看构建状态:"
echo "  eas build:list"
echo ""
