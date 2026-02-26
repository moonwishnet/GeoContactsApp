#!/bin/bash
# 超简化构建脚本 - 无需全局安装

echo "=== GeoContacts+ 快速构建 ==="
echo ""

# 解压
tar -xzf GeoContactsApp.tar.gz
cd GeoContactsApp

# 安装依赖
echo "[1/2] 安装依赖..."
npm install

# 构建
echo ""
echo "[2/2] 开始构建 APK..."
echo "首次需要登录 Expo 账号（免费）"
echo ""
npx eas-cli build -p android --profile preview

echo ""
echo "=== 构建已提交 ==="
echo "等待邮件通知或访问 expo.dev 查看进度"
