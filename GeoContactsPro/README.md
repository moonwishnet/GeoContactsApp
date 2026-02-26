# GeoContacts+ Pro

基于位置的智能通信录应用，支持个人版和企业版双模式。

## 功能特性

### 个人版
- **地图视图** - 在地图上查看联系人位置，支持多维度筛选
- **时空通讯录** - 联系人导入/导出、标签管理、分组管理
- **AI预测** - 沟通预测、相遇预测、活跃时段热力图
- **安全守护** - SOS紧急求助、亲情守护、安全区域
- **隐私保护** - 本地加密存储、细粒度授权管理

### 企业版
- **组织架构** - 部门/小组层级管理
- **外勤打卡** - 基于位置的签到签退
- **客户管理** - 客户信息、拜访记录、路线导航

## 技术栈

- React Native 0.73.0
- Expo SDK 50
- React Navigation 6
- react-native-maps
- AsyncStorage
- expo-secure-store

## 安装和运行

### 前置要求

1. Node.js 18+
2. Java JDK 17
3. Android Studio 和 Android SDK

### 安装依赖

```bash
cd GeoContactsPro
npm install
```

### 运行开发服务器

```bash
npx expo start
```

### 构建 APK

```bash
# 安装 EAS CLI
npm install -g eas-cli

# 登录 Expo 账号
eas login

# 配置构建
eas build:configure

# 构建 APK
eas build -p android --profile preview
```

## 项目结构

```
GeoContactsPro/
├── App.js                      # 应用入口
├── package.json                # 项目依赖
├── app.json                    # Expo 配置
├── eas.json                    # 构建配置
├── src/
│   ├── context/
│   │   └── AppContext.js       # 全局状态管理
│   ├── components/
│   │   ├── ContactCard.js      # 联系人卡片
│   │   ├── ModeSwitchModal.js  # 模式切换弹窗
│   │   └── PrivacyConsentModal.js # 隐私同意弹窗
│   ├── screens/
│   │   ├── personal/           # 个人版屏幕
│   │   │   ├── MapScreen.js
│   │   │   ├── ContactsScreen.js
│   │   │   ├── PredictionScreen.js
│   │   │   ├── SafetyScreen.js
│   │   │   └── ProfileScreen.js
│   │   ├── enterprise/         # 企业版屏幕
│   │   │   ├── HomeScreen.js
│   │   │   ├── OrgScreen.js
│   │   │   ├── CheckInScreen.js
│   │   │   ├── CustomersScreen.js
│   │   │   └── ProfileScreen.js
│   │   └── common/             # 公共屏幕
│   │       ├── ContactDetailScreen.js
│   │       ├── AddContactScreen.js
│   │       ├── EditContactScreen.js
│   │       ├── NavigationSettingsScreen.js
│   │       ├── TagManagerScreen.js
│   │       ├── GroupManagerScreen.js
│   │       ├── PrivacyPolicyScreen.js
│   │       ├── UserAgreementScreen.js
│   │       └── SOSAlertScreen.js
│   └── utils/
│       ├── communication.js     # 通信工具
│       ├── time.js              # 时间格式化
│       ├── aiPrediction.js      # AI预测
│       └── contactImportExport.js # 联系人导入导出
└── assets/                      # 图标资源
```

## 导航应用支持

| 应用 | Scheme | 说明 |
|------|--------|------|
| 高德地图 | amapuri:// | 国内首选 |
| 百度地图 | baidumap:// | 备选方案 |
| 腾讯地图 | qqmap:// | 备选方案 |
| Google地图 | comgooglemaps:// | 海外使用 |
| 系统默认 | geo: | 通用方案 |

## 权限说明

- **电话** - 拨打电话功能
- **位置** - 获取当前位置
- **短信** - 发送短信功能
- **联系人** - 读取系统联系人

## 许可证

MIT License
