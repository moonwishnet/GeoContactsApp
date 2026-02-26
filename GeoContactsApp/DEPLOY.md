# GeoContacts+ 部署指南

## 快速开始

### 方式一：使用 Expo Go 快速体验（推荐）

1. 在手机上安装 **Expo Go** 应用
   - Android: [Google Play 下载](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. 在项目目录下运行:
```bash
npm install
npx expo start
```

3. 用 Expo Go 扫描终端显示的二维码即可运行

### 方式二：构建独立 APK

#### 前置要求

1. **Node.js 18+**
   ```bash
   # 检查版本
   node --version
   ```

2. **Expo 账号**
   - 访问 https://expo.dev 注册免费账号

3. **EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

#### 构建步骤

1. **登录 Expo 账号**
   ```bash
   eas login
   ```

2. **配置项目**（首次运行）
   ```bash
   eas build:configure
   ```
   - 选择 `Android`
   - 选择项目 slug: `geocontacts-plus`

3. **构建 APK**
   ```bash
   # 使用 preview 配置构建 APK
   eas build -p android --profile preview
   
   # 或者使用生产配置构建 AAB (Google Play)
   eas build -p android --profile production
   ```

4. **下载 APK**
   - 构建完成后，Expo 会提供下载链接
   - 或者访问 https://expo.dev 查看构建列表

5. **安装到手机**
   - 下载 APK 文件
   - 在手机上允许"安装未知来源应用"
   - 安装 APK

#### 使用脚本构建

项目提供了自动化脚本:

```bash
# 构建 APK
./build-android.sh

# 本地开发
./run-local.sh
```

## 功能测试清单

### 基础功能
- [ ] 地图显示联系人位置
- [ ] 联系人列表显示
- [ ] 搜索联系人
- [ ] 切换维度（全部/工作/私人/附近）

### 通信功能
- [ ] 点击电话图标拨打电话
- [ ] 点击导航图标打开地图导航
- [ ] 发送短信

### 分类功能
- [ ] 查看工作分类
- [ ] 查看私人分类
- [ ] 按分类筛选联系人
- [ ] 添加/编辑/删除分类

### 设置功能
- [ ] 设置默认导航应用
- [ ] 修改隐私设置
- [ ] 查看统计信息

### SOS功能
- [ ] 点击SOS按钮
- [ ] 确认紧急呼叫

## 常见问题

### 1. 导航无法打开
- 确保手机上安装了对应的导航应用（高德/百度/腾讯地图）
- 在"我的"->"默认导航设置"中选择已安装的导航应用

### 2. 无法拨打电话
- 确保手机有 SIM 卡
- 检查电话权限是否开启

### 3. 地图不显示
- 检查网络连接
- 确保位置权限已开启

### 4. 构建失败
- 检查 Node.js 版本 (需要 18+)
- 清除缓存: `npx expo start --clear`

## 权限说明

应用需要以下权限：

| 权限 | 用途 | 必需 |
|------|------|------|
| 电话 | 拨打电话 | 是 |
| 位置 | 显示地图和附近联系人 | 是 |
| 短信 | SOS紧急呼叫 | 否 |
| 联系人 | 同步系统联系人 | 否 |

## 技术支持

如有问题，请检查:
1. README.md 中的开发文档
2. Expo 官方文档: https://docs.expo.dev
3. React Native 文档: https://reactnative.dev

## 更新日志

### v1.0.0
- 初始版本发布
- 地图视图和联系人显示
- 分类管理和筛选
- 打电话和导航功能
- SOS紧急呼叫
- 时空轨迹和AI预测
