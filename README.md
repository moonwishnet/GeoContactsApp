# GeoContacts 项目

智能位置通讯录应用，支持时空轨迹分析、分类管理、AR 导航等功能。

## 项目结构

```
GeoContactsApp/
├── GeoContactsApp/          # 基础版应用
├── GeoContactsPro/          # 专业版应用（推荐）
├── GeoContacts_Final.html   # Web 演示版
├── .github/workflows/       # GitHub Actions 工作流
├── BUILD_GUIDE.md           # 构建指南
└── APK_BUILD_INSTRUCTIONS.md  # APK 构建说明
```

## 在 GitHub 上构建 APK

### 方法一：使用 GitHub Actions（推荐）

1. **设置 Expo 访问令牌**
   - 访问 https://expo.dev/settings/access-tokens
   - 生成一个新的访问令牌
   - 在 GitHub 仓库 → Settings → Secrets and variables → Actions
   - 添加新的 secret: `EXPO_TOKEN`，值为生成的访问令牌

2. **触发构建**
   - 推送代码到 `main` 分支，自动触发构建
   - 或在 GitHub 仓库 → Actions → Build GeoContacts APK → Run workflow

3. **下载 APK**
   - 构建完成后，在 Actions 页面查看构建结果
   - 下载构建产物中的 APK 文件

### 方法二：使用 Expo 控制台

1. **访问 Expo 控制台**
   - 打开 https://expo.dev
   - 登录你的 Expo 账号

2. **导入项目**
   - 点击 "New Project"
   - 选择 "Import from GitHub"
   - 选择 `moonwishnet/GeoContactsApp` 仓库

3. **开始构建**
   - 进入项目 → Builds → New build
   - 平台: Android
   - 配置: Preview (生成 APK)
   - 点击 "Create build"

4. **下载 APK**
   - 构建完成后会收到邮件通知
   - 在构建列表中下载 APK 文件

## 本地开发

### 启动开发服务器

```bash
# 进入项目目录
cd GeoContactsPro

# 安装依赖
npm install

# 启动开发服务器
npm start
```

### 在设备上运行

1. **使用 Expo Go 应用**
   - 在 Android/iOS 设备上安装 Expo Go 应用
   - 扫描终端中显示的二维码

2. **在模拟器中运行**
   - 按 `a` 运行 Android 模拟器
   - 按 `i` 运行 iOS 模拟器

3. **在 Web 浏览器中运行**
   - 按 `w` 启动 Web 版本

## 构建配置

### EAS 构建配置

- **预览版 (preview)**: 生成 APK 文件，适合测试和分享
- **生产版 (production)**: 生成 AAB 文件，适合发布到 Google Play

### 构建命令

```bash
# 构建预览版 APK
npx eas-cli build --platform android --profile preview

# 构建生产版 AAB
npx eas-cli build --platform android --profile production

# 查看构建列表
npx eas-cli build:list
```

## 技术栈

- **前端框架**: React Native + Expo
- **导航**: React Navigation
- **状态管理**: React Context API
- **地图**: react-native-maps
- **位置服务**: expo-location
- **联系人**: expo-contacts
- **构建工具**: EAS CLI

## 功能特性

- 🌍 位置感知通讯录
- 📱 智能联系人管理
- 📅 时空轨迹分析
- 🏷️ 标签和分类管理
- 📍 AR 导航模式
- 📊 数据可视化
- 🛡️ 隐私保护
- 🔄 多平台支持

## 构建状态

[![Build GeoContacts APK](https://github.com/moonwishnet/GeoContactsApp/actions/workflows/build-android.yml/badge.svg)](https://github.com/moonwishnet/GeoContactsApp/actions/workflows/build-android.yml)

## 联系方式

- GitHub: https://github.com/moonwishnet/GeoContactsApp
- Expo: https://expo.dev
- 文档: https://docs.expo.dev
