# GeoContacts APK 构建指南

## 项目已推送到 GitHub
仓库地址: https://github.com/moonwishnet/GeoContactsApp

## 方法一：使用 Expo EAS 云端构建（推荐）

### 前提条件
1. 已登录 Expo 账号
2. 项目已配置好 `eas.json`

### 构建步骤

#### 1. 登录 Expo（如果未登录）
```bash
cd GeoContactsPro
npx eas-cli login
```

#### 2. 构建 APK（预览版）
```bash
npx eas-cli build --platform android --profile preview
```

#### 3. 构建 APK（生产版）
```bash
npx eas-cli build --platform android --profile production
```

### 构建说明
- **预览版 (preview)**: 生成 APK 文件，适合测试和分享
- **生产版 (production)**: 生成 AAB 文件，适合发布到 Google Play
- 首次构建约需 15-20 分钟
- 构建完成后会收到邮件通知
- 可在 https://expo.dev/accounts/moonwishnet/projects 查看构建状态

### 查看构建列表
```bash
npx eas-cli build:list
```

### 下载 APK
构建完成后，可以通过以下方式下载：
1. 查收邮件中的下载链接
2. 访问 Expo 控制台: https://expo.dev
3. 使用命令行查看构建详情并下载

---

## 方法二：本地构建 APK

### 前提条件
1. 安装 Android Studio
2. 配置 Android SDK
3. 配置环境变量 `ANDROID_HOME`
4. 安装 Java JDK 11+

### 构建步骤

#### 1. 预构建项目
```bash
cd GeoContactsPro
npx expo prebuild --clean
```

#### 2. 构建 Release APK
```bash
npx expo run:android --variant release
```

#### 3. APK 位置
构建完成后，APK 文件位于：
```
GeoContactsPro/android/app/build/outputs/apk/release/app-release.apk
```

---

## 项目结构说明

```
GeoContactsApp/
├── GeoContactsApp/          # 基础版应用
├── GeoContactsPro/          # 专业版应用（推荐构建此版本）
├── GeoContacts_Final.html   # Web 演示版
└── GeoContacts_Prototype*.html  # 原型版本
```

---

## 常见问题

### Q: EAS 构建失败怎么办？
A: 检查以下几点：
1. 确保 `eas.json` 配置正确
2. 检查 `app.json` 中的配置
3. 确保已登录 Expo 账号
4. 查看构建日志获取详细错误信息

### Q: 如何修改应用图标和启动画面？
A: 编辑以下文件：
- 图标: `GeoContactsPro/assets/icon.png`
- 启动画面: `GeoContactsPro/assets/splash.png`
- 配置文件: `GeoContactsPro/app.json`

### Q: 如何修改应用名称？
A: 编辑 `GeoContactsPro/app.json` 中的 `name` 和 `expo.name` 字段

---

## 快速命令参考

```bash
# 安装依赖
cd GeoContactsPro
npm install

# 启动开发服务器
npm start

# 构建 APK（云端）
npx eas-cli build --platform android --profile preview

# 查看构建状态
npx eas-cli build:list

# 查看当前登录用户
npx eas-cli whoami
```

---

## 联系方式

如有问题，请访问：
- GitHub Issues: https://github.com/moonwishnet/GeoContactsApp/issues
- Expo 文档: https://docs.expo.dev/
