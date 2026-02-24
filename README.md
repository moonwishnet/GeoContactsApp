# GeoContacts+ 安卓应用

基于位置的智能通信录应用，支持地图视图、分类管理、时空轨迹、SOS紧急呼叫等功能。

## 功能特性

### 核心功能
- **地图视图** - 在地图上查看联系人位置，支持多维度筛选
- **分类管理** - 工作/私人双维度分类，树形结构管理
- **时空轨迹** - 查看联系历史，AI预测联系时机
- **SOS紧急呼叫** - 一键发送位置并呼叫紧急联系人

### 通信功能
- **打电话** - 直接调用系统拨号界面
- **导航** - 支持高德、百度、腾讯、Google地图导航
- **发短信** - 调用系统短信应用

### 设置功能
- **默认导航设置** - 选择偏好的导航应用
- **分类管理** - 添加、编辑、删除分类
- **隐私设置** - 位置共享、隐身模式、AI建议等

## 技术栈

- React Native 0.73.0
- Expo SDK 50
- React Navigation 6
- react-native-maps
- AsyncStorage
- react-native-vector-icons

## 安装和运行

### 前置要求

1. 安装 Node.js (v18+)
2. 安装 Java JDK 17
3. 安装 Android Studio 和 Android SDK
4. 配置 ANDROID_HOME 环境变量

### 安装依赖

```bash
cd GeoContactsApp
npm install
```

### 运行开发服务器

```bash
# 启动 Expo 开发服务器
npx expo start

# 在 Android 模拟器上运行
npx expo run:android

# 或者使用 Expo Go 应用扫描二维码在真机上运行
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
GeoContactsApp/
├── App.js                      # 应用入口，导航配置
├── package.json                # 项目依赖
├── src/
│   ├── context/
│   │   └── AppContext.js       # 全局状态管理
│   ├── components/
│   │   └── ContactCard.js      # 联系人卡片组件
│   ├── screens/
│   │   ├── MapScreen.js        # 地图视图
│   │   ├── CategoryScreen.js   # 分类视图
│   │   ├── TimelineScreen.js   # 时空轨迹
│   │   ├── ProfileScreen.js    # 我的视图
│   │   ├── ContactDetailScreen.js    # 联系人详情
│   │   ├── NavigationSettingsScreen.js   # 默认导航设置
│   │   ├── CategoryManagerScreen.js      # 分类管理
│   │   └── AddContactScreen.js           # 添加联系人
│   └── utils/
│       ├── communication.js     # 通信工具（打电话、导航）
│       └── time.js              # 时间格式化工具
```

## 导航应用支持

应用支持以下导航应用：

| 应用 | Scheme | 说明 |
|------|--------|------|
| 高德地图 | `amapuri://` | 国内首选 |
| 百度地图 | `baidumap://` | 备选方案 |
| 腾讯地图 | `qqmap://` | 备选方案 |
| Google地图 | `comgooglemaps://` | 海外使用 |
| 系统默认 | `geo:` | 通用方案 |

## 权限说明

应用需要以下权限：

- **电话** - 拨打电话功能
- **位置** - 获取当前位置
- **短信** - 发送短信功能
- **联系人** - 读取系统联系人（可选）

## 注意事项

1. 导航功能需要手机上安装对应的导航应用
2. 打电话功能需要 SIM 卡支持
3. 位置功能需要开启 GPS 定位
4. SOS功能会发送短信给紧急联系人

## 开发计划

- [x] 地图视图和联系人显示
- [x] 分类管理和筛选
- [x] 时空轨迹和热力图
- [x] 打电话和导航功能
- [x] SOS紧急呼叫
- [x] 默认导航设置
- [ ] 数据备份和恢复
- [ ] 系统联系人同步
- [ ] 实时位置共享
- [ ] 消息推送通知

## 许可证

MIT License
