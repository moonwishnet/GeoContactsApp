# GeoContacts APK 构建说明

## 当前状态

项目已成功推送到 GitHub: https://github.com/moonwishnet/GeoContactsApp

## 推荐方法：使用 Expo EAS 云端构建

由于本地环境缺少 Android SDK，推荐使用 Expo EAS 云端构建服务。

### 方法一：通过 Expo 控制台构建（最简单）

1. **访问 Expo 控制台**
   - 打开浏览器访问: https://expo.dev
   - 使用你的 Expo 账号登录

2. **创建新项目**
   - 点击 "New Project"
   - 选择 "Import from GitHub"
   - 选择 `moonwishnet/GeoContactsApp` 仓库

3. **配置构建**
   - 进入项目设置
   - 选择 "Builds" 标签
   - 点击 "New build"
   - 选择平台: Android
   - 选择构建配置: Preview (生成 APK)
   - 点击 "Create build"

4. **等待构建完成**
   - 首次构建约需 15-20 分钟
   - 构建完成后会收到邮件通知
   - 可以在构建列表中下载 APK 文件

### 方法二：通过命令行构建

如果命令行环境正常，可以尝试以下步骤：

```bash
# 1. 进入项目目录
cd GeoContactsPro

# 2. 确认已登录 Expo
npx eas-cli whoami

# 3. 配置项目（首次需要）
npx eas-cli build:configure

# 4. 开始构建
npx eas-cli build --platform android --profile preview

# 5. 查看构建状态
npx eas-cli build:list
```

### 方法三：使用 Expo Go 应用（开发测试）

如果只是想测试应用，可以使用 Expo Go：

```bash
# 1. 启动开发服务器
cd GeoContactsPro
npm start

# 2. 在手机上安装 Expo Go 应用
# - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
# - iOS: https://apps.apple.com/app/expo-go/id982107779

# 3. 扫描终端中显示的二维码
```

## 本地构建（需要 Android SDK）

如果需要在本地构建 APK，需要先安装：

### 前置要求
1. **Android Studio** - https://developer.android.com/studio
2. **Java JDK 11+** - https://www.oracle.com/java/technologies/downloads/
3. **配置环境变量**
   - `ANDROID_HOME` 指向 Android SDK 路径
   - 将 `%ANDROID_HOME%\platform-tools` 和 `%ANDROID_HOME%\tools` 添加到 PATH

### 本地构建步骤

```bash
# 1. 预构建项目
cd GeoContactsPro
npx expo prebuild --clean

# 2. 构建 Release APK
npx expo run:android --variant release

# 3. APK 文件位置
# GeoContactsPro/android/app/build/outputs/apk/release/app-release.apk
```

## Web 版本运行

项目包含可以直接在浏览器中运行的 Web 版本：

```bash
# 启动 HTTP 服务器
python -m http.server 8083

# 访问
http://localhost:8083/GeoContacts_Final.html
```

## 项目文件说明

```
GeoContactsApp/
├── GeoContactsApp/          # 基础版 React Native 应用
├── GeoContactsPro/          # 专业版 React Native 应用（推荐）
├── GeoContacts_Final.html   # Web 演示版
├── GeoContacts_Prototype*.html  # 原型版本
├── BUILD_GUIDE.md           # 构建指南
└── APK_BUILD_INSTRUCTIONS.md  # 本文件
```

## 常见问题

### Q: EAS 构建失败怎么办？
A:
1. 检查 `app.json` 和 `eas.json` 配置是否正确
2. 确保已登录 Expo 账号
3. 查看构建日志获取详细错误信息
4. 尝试通过 Expo 控制台构建

### Q: 如何修改应用信息？
A: 编辑 `GeoContactsPro/app.json`:
- 应用名称: `expo.name`
- 版本号: `expo.version`
- 包名: `expo.android.package`
- 图标: `expo.icon`

### Q: 构建需要多长时间？
A:
- 首次构建: 15-20 分钟
- 后续构建: 5-10 分钟
- 构建时间取决于项目大小和服务器负载

### Q: APK 文件在哪里？
A:
- EAS 云端构建: 构建完成后在 Expo 控制台下载
- 本地构建: `GeoContactsPro/android/app/build/outputs/apk/release/`

## 快速参考

```bash
# 启动开发服务器
npm start

# 查看当前登录用户
npx eas-cli whoami

# 查看构建列表
npx eas-cli build:list

# 查看项目配置
npx expo config

# 预构建项目
npx expo prebuild --clean

# 本地构建 APK
npx expo run:android --variant release
```

## 联系与支持

- GitHub 仓库: https://github.com/moonwishnet/GeoContactsApp
- Expo 文档: https://docs.expo.dev/
- Expo 控制台: https://expo.dev
- EAS 构建文档: https://docs.expo.dev/build/introduction/
