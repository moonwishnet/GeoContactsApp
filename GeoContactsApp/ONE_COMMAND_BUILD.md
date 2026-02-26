# GeoContacts+ 一键构建指南

## 方案一：使用 Expo EAS 云构建（推荐，最简单）

### 步骤（总共约5分钟操作 + 15分钟等待）

```bash
# 1. 进入项目目录
cd GeoContactsApp

# 2. 安装依赖（1分钟）
npm install

# 3. 使用 npx 直接运行 EAS 构建（无需全局安装）
npx eas-cli build -p android --profile preview --non-interactive
```

然后：
1. 按提示登录 Expo 账号（免费注册：https://expo.dev/signup）
2. 等待约15分钟构建完成
3. 会收到邮件通知，点击链接下载 APK

---

## 方案二：本地构建（需要Android环境）

### 前置条件检查
```bash
# 检查是否已安装
java -version          # 需要 17+
echo $ANDROID_HOME     # 需要设置环境变量
```

### 构建步骤
```bash
cd GeoContactsApp
npm install
npx expo prebuild
npx expo run:android --variant release
```

---

## 方案三：使用 Docker 构建（无需配置环境）

如果您有 Docker，可以使用以下命令：

```bash
cd GeoContactsApp

# 使用 React Native 构建镜像
docker run -it --rm \
  -v $(pwd):/app \
  -w /app \
  reactnativecommunity/react-native-android \
  bash -c "npm install && cd android && ./gradlew assembleRelease"
```

APK 将生成在 `android/app/build/outputs/apk/release/app-release.apk`

---

## 方案四：GitHub Actions 自动构建

项目已配置 `.github/workflows/build.yml`，推送到 GitHub 即可自动构建：

```yaml
name: Build APK
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm install -g eas-cli
      - run: eas build -p android --profile preview --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

---

## 常见问题

### Q: 我没有Expo账号怎么办？
A: 免费注册只需1分钟：https://expo.dev/signup

### Q: 构建需要多长时间？
A: 
- 首次构建：约15-20分钟
- 后续构建：约10分钟

### Q: 构建是免费的吗？
A: Expo免费账号每月有30次构建额度，完全够用

### Q: 可以帮我构建吗？
A: 由于安全和隐私原因，我无法代您构建。但上述方案一是最简单的，只需3个命令。

---

## 最简化的完整流程

```bash
# 1. 解压项目
tar -xzf GeoContactsApp.tar.gz
cd GeoContactsApp

# 2. 安装依赖
npm install

# 3. 构建（按提示登录Expo账号）
npx eas-cli build -p android --profile preview

# 4. 等待邮件通知，下载APK
```

---

## 需要我帮您做什么？

如果您仍然无法构建，请告诉我：
1. 您的操作系统（Windows/Mac/Linux）
2. 是否已安装 Node.js
3. 是否有 Docker

我可以根据您的环境提供更具体的指导。
