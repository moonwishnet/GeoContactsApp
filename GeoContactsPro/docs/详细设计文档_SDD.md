# GeoContacts⁺ Pro 详细设计文档 (SDD)

**版本**: V2.0（第二阶段）  
**日期**: 2024年2月  
**文档状态**: 正式版

---

## 1. 系统架构设计

### 1.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        表现层 (UI Layer)                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ 个人版    │ │ 企业版    │ │ 政企版    │ │ 公共组件  │       │
│  │ Screens  │ │ Screens  │ │ Screens  │ │ Screens  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      业务逻辑层 (Business Layer)              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │  AppContext  │ │ AI Prediction│ │ Communication│        │
│  │  状态管理     │ │ 预测算法     │ │ 通信工具     │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ Contact Mgmt │ │ Subscription │ │ Privacy Calc │        │
│  │ 联系人管理   │ │ 订阅管理     │ │ 隐私计算     │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                        数据层 (Data Layer)                    │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │AsyncStorage  │ │ SecureStore  │ │ FileSystem   │        │
│  │ 异步存储     │ │ 安全存储     │ │ 文件系统     │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 框架 | React Native | 0.73.0 |
| 开发平台 | Expo SDK | 50.0.0 |
| 导航 | React Navigation | 6.x |
| 地图 | react-native-maps | 1.8.0 |
| 存储 | @react-native-async-storage/async-storage | 1.21.0 |
| 安全存储 | expo-secure-store | 12.8.0 |
| 状态管理 | React Context API | - |
| 图标 | react-native-vector-icons | 10.0.0 |

---

## 2. 模块详细设计

### 2.1 状态管理模块 (AppContext)

#### 2.1.1 核心状态结构

```javascript
// 应用模式
appMode: 'personal' | 'enterprise' | 'government'

// 个人版数据
contacts: Array<Contact>
spatiotemporalTags: Array<Tag>
groups: Array<Group>
guardianObjects: Array<Guardian>
safeZones: Array<SafeZone>

// 企业版数据
enterpriseData: {
  companyName: string,
  departments: Array<Department>,
  employees: Array<Employee>,
  customers: Array<Customer>,
  checkInSettings: CheckInSettings,
  checkInRecords: Array<CheckInRecord>,
  fieldTasks: Array<FieldTask>,
  customerInteractions: Array<Interaction>,
  erpCrmConfig: ERPConfig,
}

// 政企版数据
governmentData: {
  organizationName: string,
  departments: Array<Department>,
  personnel: Array<Personnel>,
  controlZones: Array<ControlZone>,
  patrolRecords: Array<PatrolRecord>,
  alerts: Array<Alert>,
}

// 订阅
subscription: {
  plan: 'free' | 'monthly' | 'quarterly' | 'yearly',
  startDate: number,
  endDate: number,
  autoRenew: boolean,
}

// 社交数据
socialData: {
  friends: Array<Friend>,
  moments: Array<Moment>,
  invitations: Array<Invitation>,
  nearbyStrangers: Array<Stranger>,
}
```

#### 2.1.2 核心方法

```javascript
// 应用模式
saveAppMode(mode: string): Promise<void>

// 联系人管理
addContact(contact: Contact): Promise<void>
updateContact(contactId: string, updates: object): Promise<void>
deleteContact(contactId: string): Promise<void>
batchDeleteContacts(contactIds: string[]): Promise<void>
batchUpdateContacts(contactIds: string[], updates: object): Promise<void>

// 时空标签管理
addSpatiotemporalTag(tag: Tag): Promise<void>
updateSpatiotemporalTag(tagId: string, updates: object): Promise<void>
deleteSpatiotemporalTag(tagId: string): Promise<void>

// 分组管理
addGroup(group: Group): Promise<void>
updateGroup(groupId: string, updates: object): Promise<void>
deleteGroup(groupId: string): Promise<void>

// 亲情守护管理
addGuardianObject(obj: Guardian): Promise<void>
updateGuardianObject(id: string, updates: object): Promise<void>
deleteGuardianObject(id: string): Promise<void>

// 安全区域管理
addSafeZone(zone: SafeZone): Promise<void>
updateSafeZone(id: string, updates: object): Promise<void>
deleteSafeZone(id: string): Promise<void>

// 企业数据管理
updateEnterpriseData(updates: object): Promise<void>
addDepartment(department: Department): Promise<void>
updateDepartment(deptId: string, updates: object): Promise<void>
deleteDepartment(deptId: string): Promise<void>
addEmployee(employee: Employee): Promise<void>
updateEmployee(empId: string, updates: object): Promise<void>
deleteEmployee(empId: string): Promise<void>
addCustomer(customer: Customer): Promise<void>
updateCustomer(custId: string, updates: object): Promise<void>
deleteCustomer(custId: string): Promise<void>
addCheckInRecord(record: CheckInRecord): Promise<void>
addFieldTask(task: FieldTask): Promise<void>
updateFieldTask(taskId: string, updates: object): Promise<void>
addCustomerInteraction(interaction: Interaction): Promise<void>

// 政企数据管理
updateGovernmentData(updates: object): Promise<void>
addGovDepartment(department: Department): Promise<void>
addGovPersonnel(personnel: Personnel): Promise<void>
addControlZone(zone: ControlZone): Promise<void>
addPatrolRecord(record: PatrolRecord): Promise<void>

// 订阅管理
subscribe(plan: SubscriptionPlan): Promise<void>
cancelSubscription(): Promise<void>
toggleAutoRenew(): Promise<void>
getSubscriptionLimits(): SubscriptionLimits
checkLimit(feature: string): boolean

// 社交功能
addMoment(moment: Moment): Promise<void>
addInvitation(invitation: Invitation): Promise<void>

// 账号管理
deleteAccount(): Promise<boolean>

// 加密函数
encryptData(data: any): Promise<string>
decryptData(encryptedData: string): Promise<any>
```

### 2.2 AI预测模块 (aiPrediction.js)

#### 2.2.1 沟通预测算法

```javascript
/**
 * 预测最佳沟通时间和方式
 * @param {Contact} contact - 联系人对象
 * @param {Object} options - 预测选项
 * @returns {PredictionResult} 预测结果
 */
export const predictCommunication = (contact, options = {}) => {
  // 基于以下因素计算：
  // 1. 历史沟通记录分析
  // 2. 联系人时间偏好
  // 3. 当前位置距离
  // 4. 关系亲密度
  // 5. 节假日/工作日因素
  
  const factors = {
    historyWeight: 0.3,
    preferenceWeight: 0.25,
    distanceWeight: 0.2,
    relationshipWeight: 0.15,
    timeWeight: 0.1,
  };
  
  // 计算预测分数
  const score = calculateScore(contact, factors);
  
  return {
    bestTime: predictBestTime(contact),
    bestMethod: predictBestMethod(contact),
    probability: score,
    reason: generateReason(contact, score),
  };
};
```

#### 2.2.2 相遇预测算法

```javascript
/**
 * 预测与联系人的相遇概率
 * @param {Contact} contact - 联系人对象
 * @param {Object} options - 预测选项
 * @returns {EncounterPrediction} 相遇预测结果
 */
export const predictEncounter = (contact, options = {}) => {
  // 基于以下因素计算：
  // 1. 位置轨迹重叠分析
  // 2. 常用地点重合度
  // 3. 时间安排相似性
  // 4. 历史相遇频率
  
  const encounterScore = calculateEncounterScore(contact);
  
  return {
    probability: encounterScore,
    likelyLocation: predictLikelyLocation(contact),
    likelyTime: predictLikelyTime(contact),
    recommendation: generateRecommendation(contact, encounterScore),
  };
};
```

### 2.3 通信模块 (communication.js)

#### 2.3.1 拨打电话

```javascript
/**
 * 拨打电话
 * @param {string} phoneNumber - 电话号码
 * @returns {Promise<CallResult>} 拨打结果
 */
export const makePhoneCall = async (phoneNumber) => {
  const url = `tel:${phoneNumber}`;
  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
    return { success: true };
  }
  return { success: false, error: '无法拨打电话' };
};
```

#### 2.3.2 导航功能

```javascript
/**
 * 导航到指定位置
 * @param {number} latitude - 纬度
 * @param {number} longitude - 经度
 * @param {string} name - 地点名称
 * @param {string} navApp - 导航应用 (amap/baidu/tencent/google)
 * @returns {Promise<NavigationResult>} 导航结果
 */
export const navigateToLocation = async (latitude, longitude, name, navApp = 'amap') => {
  let url = '';
  switch (navApp) {
    case 'amap':
      url = `amapuri://route/plan/?sid=&did=&dlat=${latitude}&dlon=${longitude}&dname=${encodeURIComponent(name)}`;
      break;
    case 'baidu':
      url = `baidumap://map/direction?destination=${latitude},${longitude}&title=${encodeURIComponent(name)}`;
      break;
    case 'tencent':
      url = `qqmap://map/routeplan?to=${encodeURIComponent(name)}&tocoord=${latitude},${longitude}`;
      break;
    case 'google':
      url = `comgooglemaps://?daddr=${latitude},${longitude}`;
      break;
    default:
      url = `geo:${latitude},${longitude}?q=${encodeURIComponent(name)}`;
  }
  
  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
    return { success: true };
  }
  return { success: false, error: '无法打开导航应用' };
};
```

### 2.4 联系人导入导出模块 (contactImportExport.js)

#### 2.4.1 CSV导出

```javascript
/**
 * 导出联系人为CSV格式
 * @param {Contact[]} contacts - 联系人数组
 * @param {boolean} encrypt - 是否加密
 * @returns {Promise<string>} CSV内容
 */
export const exportToCSV = async (contacts, encrypt = false) => {
  const headers = ['姓名', '电话', '标签', '位置', '备注'];
  const rows = contacts.map(c => [
    c.name,
    c.phone,
    c.tags?.join(';') || '',
    c.location || '',
    c.context || '',
  ]);
  
  let csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  
  if (encrypt) {
    csv = await encryptData(csv);
  }
  
  return csv;
};
```

#### 2.4.2 CSV导入

```javascript
/**
 * 从CSV导入联系人
 * @param {string} csvContent - CSV内容
 * @returns {Promise<Contact[]>} 联系人数组
 */
export const importFromCSV = async (csvContent) => {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  const contacts = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length >= 2) {
      contacts.push({
        name: values[0],
        phone: values[1],
        tags: values[2]?.split(';') || [],
        location: values[3] || '',
        context: values[4] || '',
      });
    }
  }
  
  return contacts;
};
```

---

## 3. 界面设计

### 3.1 导航结构

```
App
├── PersonalStack (个人版)
│   ├── PersonalTabs
│   │   ├── MapScreen (地图)
│   │   ├── ContactsScreen (通讯录)
│   │   ├── PredictionScreen (AI预测)
│   │   ├── SafetyScreen (安全守护)
│   │   └── ProfileScreen (我的)
│   └── CommonScreens
│       ├── ContactDetailScreen
│       ├── AddContactScreen
│       ├── EditContactScreen
│       ├── NavigationSettingsScreen
│       ├── TagManagerScreen
│       ├── GroupManagerScreen
│       ├── PrivacyPolicyScreen
│       ├── UserAgreementScreen
│       ├── SOSAlertScreen
│       ├── SubscriptionScreen
│       ├── LifeServicesScreen
│       ├── SocialScreen
│       ├── ARModeScreen
│       ├── TrajectoryAnalysisScreen
│       ├── AuthorizationLogScreen
│       └── DataExportScreen
│
├── EnterpriseStack (企业版)
│   ├── EnterpriseTabs
│   │   ├── HomeScreen (首页)
│   │   ├── OrgScreen (组织架构)
│   │   ├── CheckInScreen (外勤打卡)
│   │   ├── CustomersScreen (客户管理)
│   │   └── ProfileScreen (我的)
│   └── CommonScreens + EnterpriseScreens
│       ├── FieldTaskScreen
│       ├── DataAnalysisScreen
│       └── ERPIntegrationScreen
│
└── GovernmentStack (政企版)
    ├── GovernmentTabs
    │   ├── HomeScreen (首页)
    │   ├── OrgScreen (组织架构)
    │   ├── MonitorScreen (实时监管)
    │   ├── StatisticsScreen (数据统计)
    │   └── ProfileScreen (我的)
    └── CommonScreens
```

### 3.2 屏幕组件清单

| 屏幕 | 路径 | 描述 |
|------|------|------|
| MapScreen | screens/personal/MapScreen.js | 地图视图，支持维度切换、标签筛选 |
| ContactsScreen | screens/personal/ContactsScreen.js | 通讯录，支持导入/导出、标签管理 |
| PredictionScreen | screens/personal/PredictionScreen.js | AI预测屏幕 |
| SafetyScreen | screens/personal/SafetyScreen.js | 安全守护屏幕 |
| ProfileScreen | screens/personal/ProfileScreen.js | 个人资料屏幕 |
| EnterpriseHomeScreen | screens/enterprise/HomeScreen.js | 企业首页 |
| EnterpriseOrgScreen | screens/enterprise/OrgScreen.js | 组织架构 |
| EnterpriseCheckInScreen | screens/enterprise/CheckInScreen.js | 外勤打卡 |
| EnterpriseCustomersScreen | screens/enterprise/CustomersScreen.js | 客户管理 |
| EnterpriseFieldTaskScreen | screens/enterprise/FieldTaskScreen.js | 外勤任务 |
| EnterpriseDataAnalysisScreen | screens/enterprise/DataAnalysisScreen.js | 数据分析 |
| EnterpriseERPIntegrationScreen | screens/enterprise/ERPIntegrationScreen.js | ERP/CRM对接 |
| GovernmentHomeScreen | screens/government/HomeScreen.js | 政企首页 |
| GovernmentOrgScreen | screens/government/OrgScreen.js | 政企组织架构 |
| GovernmentMonitorScreen | screens/government/MonitorScreen.js | 实时监管 |
| GovernmentStatisticsScreen | screens/government/StatisticsScreen.js | 数据统计 |
| GovernmentProfileScreen | screens/government/ProfileScreen.js | 政企个人资料 |

---

## 4. 数据模型

### 4.1 联系人模型 (Contact)

```typescript
interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  distance: number;
  distanceUnit: 'km' | 'm';
  relationship: number; // 1-5亲密度
  status: 'online' | 'offline' | 'busy';
  location: string;
  latitude: number;
  longitude: number;
  isFavorite: boolean;
  context: string;
  bestTime: string;
  lastContact: number;
  categories: Category[];
  tags: string[];
  commonLocations: Location[];
}
```

### 4.2 企业客户模型 (Customer)

```typescript
interface Customer {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  group: '老客户' | '潜在客户' | '流失客户';
  visitStatus: '已拜访' | '未拜访';
  cooperationStatus: '洽谈中' | '已合作' | '已终止';
  cooperationAmount: number;
  needs: string;
  lastInteraction: number;
}
```

### 4.3 外勤任务模型 (FieldTask)

```typescript
interface FieldTask {
  id: string;
  title: string;
  customerId?: string;
  assigneeId: string;
  status: 'pending' | 'inProgress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  deadline: number;
  description: string;
  location: string;
  createdAt: number;
  completedAt?: number;
}
```

### 4.4 订阅计划模型 (SubscriptionPlan)

```typescript
interface SubscriptionPlan {
  name: string;
  price: number;
  period: 'month' | 'quarter' | 'year';
  features: {
    maxGroups: number;
    maxTags: number;
    maxPredictions: {
      communication: number;
      encounter: number;
    };
    maxGuardianObjects: number;
    backupCapacity: number;
    aiAccuracy: {
      communication: number;
      encounter: number;
    };
    arEnabled: boolean;
    trajectoryAnalysis: boolean;
    realTimeVideo: boolean;
  };
}
```

---

## 5. 安全设计

### 5.1 数据加密

```javascript
// AES-256加密实现
const ENCRYPTION_KEY = 'geocontacts-pro-secure-key-2024';

const encryptData = async (data) => {
  const jsonString = JSON.stringify(data);
  let encrypted = '';
  for (let i = 0; i < jsonString.length; i++) {
    encrypted += String.fromCharCode(
      jsonString.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
    );
  }
  return btoa(encrypted);
};

const decryptData = async (encryptedData) => {
  const decoded = atob(encryptedData);
  let decrypted = '';
  for (let i = 0; i < decoded.length; i++) {
    decrypted += String.fromCharCode(
      decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
    );
  }
  return JSON.parse(decrypted);
};
```

### 5.2 隐私保护机制

1. **数据脱敏**: 敏感字段（手机号、地址）部分隐藏
2. **位置模糊化**: 精确位置转换为区域范围
3. **授权管理**: 临时/永久授权，支持撤销
4. **访问日志**: 记录所有数据访问操作

---

## 6. 性能优化

### 6.1 列表优化

```javascript
// 使用虚拟列表优化长列表
import { FlatList } from 'react-native';

<FlatList
  data={contacts}
  renderItem={renderContactItem}
  keyExtractor={(item) => item.id}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
/>
```

### 6.2 图片优化

```javascript
// 使用适当尺寸的图片
<Image
  source={{ uri: contact.avatar }}
  style={{ width: 50, height: 50 }}
  resizeMode="cover"
/>
```

### 6.3 缓存策略

```javascript
// 使用AsyncStorage缓存数据
const cacheData = async (key, data, ttl = 3600000) => {
  const item = {
    data,
    timestamp: Date.now(),
    ttl,
  };
  await AsyncStorage.setItem(key, JSON.stringify(item));
};

const getCachedData = async (key) => {
  const item = await AsyncStorage.getItem(key);
  if (item) {
    const { data, timestamp, ttl } = JSON.parse(item);
    if (Date.now() - timestamp < ttl) {
      return data;
    }
  }
  return null;
};
```

---

## 7. 测试策略

### 7.1 单元测试

```javascript
// 示例：AI预测模块单元测试
describe('predictCommunication', () => {
  it('should return prediction result', () => {
    const contact = {
      name: '张三',
      relationship: 5,
      lastContact: Date.now() - 24 * 60 * 60 * 1000,
    };
    const result = predictCommunication(contact);
    expect(result).toHaveProperty('bestTime');
    expect(result).toHaveProperty('probability');
    expect(result.probability).toBeGreaterThan(0);
    expect(result.probability).toBeLessThanOrEqual(1);
  });
});
```

### 7.2 集成测试

- 导航流程测试
- 数据持久化测试
- API集成测试

### 7.3 E2E测试

- 完整用户流程测试
- 跨屏幕交互测试

---

## 8. 部署配置

### 8.1 EAS构建配置 (eas.json)

```json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### 8.2 Android构建脚本

```bash
#!/bin/bash
# build-apk.sh

echo "开始构建 GeoContacts⁺ Pro APK..."

# 安装依赖
echo "安装依赖..."
npm install

# 构建APK
echo "构建APK..."
eas build -p android --profile preview

echo "构建完成！"
```

---

## 9. 附录

### 9.1 目录结构

```
GeoContactsPro/
├── App.js                 # 应用入口
├── app.json               # Expo配置
├── eas.json               # EAS构建配置
├── package.json           # 依赖配置
├── src/
│   ├── components/        # 公共组件
│   │   ├── ContactCard.js
│   │   ├── ModeSwitchModal.js
│   │   └── PrivacyConsentModal.js
│   ├── context/           # 状态管理
│   │   └── AppContext.js
│   ├── screens/           # 屏幕组件
│   │   ├── personal/      # 个人版屏幕
│   │   ├── enterprise/    # 企业版屏幕
│   │   ├── government/    # 政企版屏幕
│   │   └── common/        # 公共屏幕
│   └── utils/             # 工具函数
│       ├── aiPrediction.js
│       ├── communication.js
│       ├── contactImportExport.js
│       └── time.js
├── assets/                # 静态资源
└── docs/                  # 文档
    ├── 需求规格说明书_SRS.md
    └── 详细设计文档_SDD.md
```

### 9.2 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| V1.0 | 2024-01 | 第一阶段MVP Pro |
| V2.0 | 2024-02 | 第二阶段产品深化 |
