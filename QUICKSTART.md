# GeoContacts+ 快速开始指南

## 项目已完成 ✅

GeoContacts+ 安卓应用已全部开发完成，包含以下功能：

### 已实现功能

| 功能模块 | 状态 | 说明 |
|---------|------|------|
| 地图视图 | ✅ | 显示联系人位置，支持多维度筛选 |
| 联系人列表 | ✅ | 按最近联系/距离排序 |
| 分类管理 | ✅ | 工作/私人双维度分类 |
| 打电话 | ✅ | 调用系统拨号界面 |
| 导航 | ✅ | 支持高德/百度/腾讯/Google地图 |
| SOS紧急呼叫 | ✅ | 一键发送位置并呼叫 |
| 时空轨迹 | ✅ | 联系历史时间轴 |
| AI预测 | ✅ | 智能联系建议 |
| 热力图 | ✅ | 活跃时段分析 |
| 默认导航设置 | ✅ | 选择偏好导航应用 |
| 分类编辑器 | ✅ | 添加/编辑/删除分类 |
| 添加联系人 | ✅ | 完整的新增联系人功能 |

## 快速部署（3种方式）

### 方式一：Expo Go 快速体验（5分钟）

```bash
# 1. 进入项目目录
cd GeoContactsApp

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npx expo start

# 4. 手机安装 Expo Go 应用，扫描二维码
```

### 方式二：构建 APK（30分钟）

```bash
# 1. 安装 EAS CLI
npm install -g eas-cli

# 2. 登录 Expo 账号（免费注册）
eas login

# 3. 构建 APK
eas build -p android --profile preview

# 4. 等待构建完成，下载 APK 安装
```

### 方式三：使用脚本

```bash
# 本地开发
./run-local.sh

# 构建 APK
./build-android.sh
```

## 项目文件说明

```
GeoContactsApp/
├── App.js                      # 应用入口
├── package.json                # 依赖配置
├── app.json                    # Expo 配置
├── eas.json                    # 构建配置
├── README.md                   # 项目文档
├── DEPLOY.md                   # 部署指南
├── QUICKSTART.md               # 本文件
├── build-android.sh            # 构建脚本
├── run-local.sh                # 开发脚本
├── assets/                     # 图标资源
│   ├── icon.png
│   ├── adaptive-icon.png
│   ├── splash.png
│   └── favicon.png
└── src/
    ├── context/
    │   └── AppContext.js       # 全局状态
    ├── components/
    │   └── ContactCard.js      # 联系人卡片
    ├── screens/
    │   ├── MapScreen.js        # 地图视图 ⭐
    │   ├── CategoryScreen.js   # 分类视图 ⭐
    │   ├── TimelineScreen.js   # 时空轨迹 ⭐
    │   ├── ProfileScreen.js    # 我的视图 ⭐
    │   ├── ContactDetailScreen.js    # 联系人详情
    │   ├── NavigationSettingsScreen.js # 导航设置 ⭐
    │   ├── CategoryManagerScreen.js    # 分类管理
│   │   └── AddContactScreen.js       # 添加联系人
    └── utils/
        ├── communication.js    # 打电话/导航
        └── time.js             # 时间格式化
```

## 核心功能演示

### 1. 打电话功能
```javascript
// src/utils/communication.js
export const makePhoneCall = async (phoneNumber) => {
  const url = `tel:${phoneNumber}`;
  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
    return true;
  }
  return false;
};
```

### 2. 导航功能（支持多地图）
```javascript
// src/utils/communication.js
export const navigateToLocation = async (lat, lng, name, navApp = 'amap') => {
  let url = '';
  switch (navApp) {
    case 'amap':
      url = `amapuri://route/plan/?dlat=${lat}&dlon=${lng}&dname=${name}`;
      break;
    case 'baidu':
      url = `baidumap://map/direction?destination=latlng:${lat},${lng}|name:${name}`;
      break;
    // ... 其他地图
  }
  await Linking.openURL(url);
};
```

### 3. 默认导航设置
- 路径：我的 → 默认导航设置
- 支持：高德地图、百度地图、腾讯地图、Google地图、系统默认
- 自动检测已安装的导航应用

## 测试清单

部署后请测试以下功能：

- [ ] 地图显示联系人位置标记
- [ ] 点击电话图标能拨打真实电话
- [ ] 点击导航图标能打开导航应用
- [ ] 切换维度（全部/工作/私人/附近）
- [ ] 分类筛选功能
- [ ] SOS紧急按钮弹出确认框
- [ ] 默认导航设置能保存
- [ ] 添加新联系人

## 注意事项

1. **导航功能**需要手机上安装对应的导航应用
2. **打电话功能**需要 SIM 卡支持
3. **位置功能**需要开启 GPS 定位
4. **SOS功能**会发送短信给紧急联系人

## 下一步

1. 解压 `GeoContactsApp.tar.gz`
2. 按照上述方式运行或构建
3. 在安卓手机上安装测试

祝您测试顺利！
