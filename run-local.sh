#!/bin/bash

# GeoContacts+ 本地开发运行脚本

echo "================================"
echo "GeoContacts+ 本地开发服务器"
echo "================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "错误: 未找到 Node.js，请先安装 Node.js 18+"
    exit 1
fi

echo "Node.js 版本: $(node --version)"

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo ""
    echo "首次运行，安装依赖..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "错误: 依赖安装失败"
        exit 1
    fi
fi

echo ""
echo "启动开发服务器..."
echo ""
echo "请在 Android 设备上执行以下操作之一:"
echo "1. 使用 Expo Go 应用扫描二维码"
echo "2. 在 Android 模拟器上运行"
echo "3. 使用 USB 调试连接真机"
echo ""

npx expo start
