import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const AppContext = createContext();

// 加密密钥（实际应用中应从安全存储获取）
const ENCRYPTION_KEY = 'geocontacts-pro-secure-key-2024';

// AES-256加密函数
const encryptData = async (data) => {
  try {
    const jsonString = JSON.stringify(data);
    // 使用简单的XOR加密（生产环境应使用更安全的加密方式）
    let encrypted = '';
    for (let i = 0; i < jsonString.length; i++) {
      encrypted += String.fromCharCode(
        jsonString.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
      );
    }
    return btoa(encrypted);
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

// AES-256解密函数
const decryptData = async (encryptedData) => {
  try {
    const decoded = atob(encryptedData);
    let decrypted = '';
    for (let i = 0; i < decoded.length; i++) {
      decrypted += String.fromCharCode(
        decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
      );
    }
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// 初始联系人数据
const initialContacts = [
  {
    id: '1',
    name: '张三',
    phone: '13800000001',
    avatar: null,
    distance: 0.8,
    distanceUnit: 'km',
    relationship: 5,
    status: 'online',
    location: '中关村软件园',
    latitude: 39.9845,
    longitude: 116.3075,
    isFavorite: true,
    context: '工作时间可联系',
    bestTime: '18:30后',
    lastContact: Date.now() - 2 * 60 * 60 * 1000,
    categories: [
      { dim: 'work', nodeId: 'w1-1', path: ['进行中项目', 'Alpha项目'] },
      { dim: 'work', nodeId: 'w2-1', path: ['组织架构', '技术委员会'] },
    ],
    tags: ['技术总监', '后端专家'],
    commonLocations: [
      { type: 'home', name: '家', address: '北京市海淀区xxx小区', latitude: 39.98, longitude: 116.30 },
      { type: 'work', name: '公司', address: '中关村软件园', latitude: 39.9845, longitude: 116.3075 },
    ],
  },
  {
    id: '2',
    name: '李四',
    phone: '13900000002',
    avatar: null,
    distance: 2.5,
    distanceUnit: 'km',
    relationship: 4,
    status: 'busy',
    location: '家中',
    latitude: 39.9042,
    longitude: 116.4074,
    isFavorite: true,
    context: '周末休息',
    bestTime: '随时',
    lastContact: Date.now() - 24 * 60 * 60 * 1000,
    categories: [
      { dim: 'personal', nodeId: 'p1-4', path: ['同学', '大学同学'] },
      { dim: 'personal', nodeId: 'p2-2', path: ['活动圈子', '读书会'] },
    ],
    tags: ['室友', '文学爱好者'],
    commonLocations: [
      { type: 'home', name: '家', address: '北京市朝阳区xxx小区', latitude: 39.90, longitude: 116.41 },
    ],
  },
  {
    id: '3',
    name: '王五',
    phone: '13700000003',
    avatar: null,
    distance: 0.5,
    distanceUnit: 'km',
    relationship: 3,
    status: 'online',
    location: '万达广场',
    latitude: 39.9289,
    longitude: 116.4603,
    isFavorite: false,
    context: '午餐时间有空',
    bestTime: '12:00-13:00',
    lastContact: Date.now() - 4 * 60 * 60 * 1000,
    categories: [
      { dim: 'work', nodeId: 'w3-1', path: ['外部关系', '核心客户'] },
      { dim: 'personal', nodeId: 'p2-3', path: ['活动圈子', '羽毛球俱乐部'] },
    ],
    tags: ['客户代表', '运动达人'],
    commonLocations: [
      { type: 'work', name: '公司', address: '万达广场', latitude: 39.9289, longitude: 116.4603 },
    ],
  },
];

// 时空标签
const initialSpatiotemporalTags = [
  { id: 'tag-1', name: '家附近联系人', color: 'green', icon: 'home', category: 'personal' },
  { id: 'tag-2', name: '公司同事', color: 'blue', icon: 'briefcase', category: 'work' },
  { id: 'tag-3', name: '常去地点联系人', color: 'orange', icon: 'map-marker-alt', category: 'life' },
];

// 企业初始数据
const initialEnterpriseData = {
  companyName: '示例科技有限公司',
  departments: [
    {
      id: 'dept-1',
      name: '技术部',
      parentId: null,
      level: 1,
      managerId: 'emp-1',
      employees: ['emp-1', 'emp-2', 'emp-3'],
    },
    {
      id: 'dept-2',
      name: '前端组',
      parentId: 'dept-1',
      level: 2,
      managerId: 'emp-2',
      employees: ['emp-2', 'emp-4'],
    },
    {
      id: 'dept-3',
      name: '后端组',
      parentId: 'dept-1',
      level: 2,
      managerId: 'emp-3',
      employees: ['emp-3', 'emp-5'],
    },
    {
      id: 'dept-4',
      name: '销售部',
      parentId: null,
      level: 1,
      managerId: 'emp-6',
      employees: ['emp-6', 'emp-7'],
    },
  ],
  employees: [
    { id: 'emp-1', name: '张总', phone: '13800001001', departmentId: 'dept-1', position: 'CTO', isManager: true, status: '在岗' },
    { id: 'emp-2', name: '李前端', phone: '13800001002', departmentId: 'dept-2', position: '高级工程师', isManager: true, status: '外勤' },
    { id: 'emp-3', name: '王后端', phone: '13800001003', departmentId: 'dept-3', position: '架构师', isManager: true, status: '在岗' },
    { id: 'emp-4', name: '赵小明', phone: '13800001004', departmentId: 'dept-2', position: '前端开发', isManager: false, status: '请假' },
    { id: 'emp-5', name: '钱小红', phone: '13800001005', departmentId: 'dept-3', position: '后端开发', isManager: false, status: '在岗' },
    { id: 'emp-6', name: '孙销售', phone: '13800001006', departmentId: 'dept-4', position: '销售总监', isManager: true, status: '外勤' },
    { id: 'emp-7', name: '周客户', phone: '13800001007', departmentId: 'dept-4', position: '客户经理', isManager: false, status: '在岗' },
  ],
  customers: [
    { 
      id: 'cust-1', 
      name: 'ABC科技公司', 
      contactName: '刘经理', 
      phone: '13900002001', 
      address: '北京市朝阳区国贸大厦', 
      latitude: 39.9078, 
      longitude: 116.4645, 
      group: '老客户', 
      visitStatus: '已拜访',
      cooperationStatus: '已合作',
      cooperationAmount: 500000,
      needs: '需要技术支持',
      lastInteraction: Date.now() - 7 * 24 * 60 * 60 * 1000,
    },
    { 
      id: 'cust-2', 
      name: 'XYZ贸易公司', 
      contactName: '陈总', 
      phone: '13900002002', 
      address: '北京市海淀区中关村', 
      latitude: 39.9845, 
      longitude: 116.3075, 
      group: '潜在客户', 
      visitStatus: '未拜访',
      cooperationStatus: '洽谈中',
      cooperationAmount: 0,
      needs: '了解产品方案',
      lastInteraction: Date.now() - 14 * 24 * 60 * 60 * 1000,
    },
  ],
  checkInSettings: {
    enabled: true,
    startTime: '09:00',
    endTime: '18:00',
    radius: 500,
    location: { latitude: 39.9845, longitude: 116.3075, address: '公司总部' },
    reminderMinutes: 10,
    flexibleCheckIn: false,
    allowMultipleLocations: true,
    requirePhoto: false,
  },
  checkInRecords: [],
  fieldTasks: [],
  fieldTracks: [],
  customerInteractions: [],
  erpCrmConfig: {
    enabled: false,
    systemType: null,
    apiEndpoint: '',
    syncFrequency: 'hourly',
    lastSync: null,
  },
};

// 政企版初始数据
const initialGovernmentData = {
  organizationName: '示例政企单位',
  orgLevel: 3,
  departments: [
    { id: 'gov-dept-1', name: '领导办公室', parentId: null, level: 1, managerId: 'gov-emp-1' },
    { id: 'gov-dept-2', name: '综合管理部', parentId: null, level: 1, managerId: 'gov-emp-2' },
    { id: 'gov-dept-3', name: '执法一队', parentId: 'gov-dept-2', level: 2, managerId: 'gov-emp-3' },
    { id: 'gov-dept-4', name: '执法二队', parentId: 'gov-dept-2', level: 2, managerId: 'gov-emp-4' },
  ],
  personnel: [
    { id: 'gov-emp-1', name: '李局长', phone: '13800003001', departmentId: 'gov-dept-1', position: '局长', workLocation: '机关大楼', status: '执勤中' },
    { id: 'gov-emp-2', name: '王主任', phone: '13800003002', departmentId: 'gov-dept-2', position: '主任', workLocation: '机关大楼', status: '执勤中' },
    { id: 'gov-emp-3', name: '张队长', phone: '13800003003', departmentId: 'gov-dept-3', position: '队长', workLocation: '执法区域A', status: '巡检中' },
    { id: 'gov-emp-4', name: '赵队长', phone: '13800003004', departmentId: 'gov-dept-4', position: '队长', workLocation: '执法区域B', status: '执勤中' },
  ],
  controlZones: [
    { id: 'zone-1', name: '执勤区域A', type: 'work', latitude: 39.9845, longitude: 116.3075, radius: 1000 },
    { id: 'zone-2', name: '执勤区域B', type: 'work', latitude: 39.9289, longitude: 116.4603, radius: 800 },
    { id: 'zone-3', name: '禁止区域', type: 'forbidden', latitude: 39.90, longitude: 116.40, radius: 500 },
  ],
  patrolRecords: [],
  alerts: [],
};

// 支持的导航应用
export const NAVIGATION_APPS = {
  amap: { name: '高德地图', package: 'com.autonavi.minimap', scheme: 'amapuri://route/plan/' },
  baidu: { name: '百度地图', package: 'com.baidu.BaiduMap', scheme: 'baidumap://map/direction' },
  tencent: { name: '腾讯地图', package: 'com.tencent.map', scheme: 'qqmap://map/routeplan' },
  google: { name: 'Google地图', package: 'com.google.android.apps.maps', scheme: 'comgooglemaps://' },
  system: { name: '系统默认', package: '', scheme: 'geo:' },
};

// 订阅计划
export const SUBSCRIPTION_PLANS = {
  free: {
    name: '免费版',
    price: 0,
    features: {
      maxGroups: 10,
      maxTags: 20,
      maxPredictions: { communication: 3, encounter: 2 },
      maxGuardianObjects: 3,
      backupCapacity: 500 * 1024 * 1024, // 500MB
      aiAccuracy: { communication: 70, encounter: 65 },
      arEnabled: false,
      trajectoryAnalysis: false,
      realTimeVideo: false,
    },
  },
  monthly: {
    name: '月付版',
    price: 19.9,
    period: 'month',
    features: {
      maxGroups: Infinity,
      maxTags: Infinity,
      maxPredictions: { communication: Infinity, encounter: Infinity },
      maxGuardianObjects: Infinity,
      backupCapacity: Infinity,
      aiAccuracy: { communication: 80, encounter: 75 },
      arEnabled: true,
      trajectoryAnalysis: true,
      realTimeVideo: true,
    },
  },
  quarterly: {
    name: '季付版',
    price: 49.9,
    period: 'quarter',
    features: {
      maxGroups: Infinity,
      maxTags: Infinity,
      maxPredictions: { communication: Infinity, encounter: Infinity },
      maxGuardianObjects: Infinity,
      backupCapacity: Infinity,
      aiAccuracy: { communication: 80, encounter: 75 },
      arEnabled: true,
      trajectoryAnalysis: true,
      realTimeVideo: true,
    },
  },
  yearly: {
    name: '年付版',
    price: 168,
    period: 'year',
    features: {
      maxGroups: Infinity,
      maxTags: Infinity,
      maxPredictions: { communication: Infinity, encounter: Infinity },
      maxGuardianObjects: Infinity,
      backupCapacity: Infinity,
      aiAccuracy: { communication: 80, encounter: 75 },
      arEnabled: true,
      trajectoryAnalysis: true,
      realTimeVideo: true,
    },
  },
};

export function AppProvider({ children }) {
  // 应用模式：'personal' | 'enterprise' | 'government'
  const [appMode, setAppMode] = useState('personal');
  
  // 个人版数据
  const [contacts, setContacts] = useState(initialContacts);
  const [spatiotemporalTags, setSpatiotemporalTags] = useState(initialSpatiotemporalTags);
  const [groups, setGroups] = useState([]);
  const [guardianObjects, setGuardianObjects] = useState([]);
  const [safeZones, setSafeZones] = useState([]);
  
  // 企业版数据
  const [enterpriseData, setEnterpriseData] = useState(initialEnterpriseData);
  
  // 政企版数据
  const [governmentData, setGovernmentData] = useState(initialGovernmentData);
  
  // 高级订阅
  const [subscription, setSubscription] = useState({
    plan: 'free',
    startDate: null,
    endDate: null,
    autoRenew: false,
  });
  
  // 时空社交数据
  const [socialData, setSocialData] = useState({
    friends: [],
    moments: [],
    invitations: [],
    nearbyStrangers: [],
  });
  
  // 生活服务数据
  const [lifeServices, setLifeServices] = useState({
    favorites: [],
    travelRecords: [],
  });
  
  // 通用设置
  const [defaultNavigation, setDefaultNavigation] = useState('amap');
  const [settings, setSettings] = useState({
    location: true,
    backgroundLocation: false,
    contacts: true,
    notification: true,
    stealth: false,
    ai: true,
    dark: true,
    socialEnabled: false,
    arEnabled: false,
    voiceInteraction: true,
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    agreedToPrivacyPolicy: false,
    agreedToUserAgreement: false,
    dataEncryption: true,
    autoBackup: false,
    locationMasking: false,
    contactMasking: false,
    authorizationLog: [],
  });
  
  const [sosContacts, setSosContacts] = useState([
    { name: '父亲', phone: '13800000001', priority: 1 },
    { name: '母亲', phone: '13900000002', priority: 2 },
    { name: '紧急联系人', phone: '110', priority: 3 },
  ]);
  
  const [sosSettings, setSosSettings] = useState({
    voiceEnabled: true,
    videoEnabled: false,
    cloudBackup: true,
    emergencyPriority: true,
  });

  // 加载保存的设置
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedMode = await AsyncStorage.getItem('appMode');
      if (savedMode) setAppMode(savedMode);
      
      const savedNav = await AsyncStorage.getItem('defaultNavigation');
      if (savedNav) setDefaultNavigation(savedNav);
      
      const savedSettings = await AsyncStorage.getItem('settings');
      if (savedSettings) setSettings(JSON.parse(savedSettings));
      
      const savedPrivacy = await AsyncStorage.getItem('privacySettings');
      if (savedPrivacy) setPrivacySettings(JSON.parse(savedPrivacy));
      
      const savedSos = await AsyncStorage.getItem('sosContacts');
      if (savedSos) setSosContacts(JSON.parse(savedSos));
      
      const savedSosSettings = await AsyncStorage.getItem('sosSettings');
      if (savedSosSettings) setSosSettings(JSON.parse(savedSosSettings));
      
      const savedContacts = await AsyncStorage.getItem('contacts');
      if (savedContacts) setContacts(JSON.parse(savedContacts));
      
      const savedTags = await AsyncStorage.getItem('spatiotemporalTags');
      if (savedTags) setSpatiotemporalTags(JSON.parse(savedTags));
      
      const savedGroups = await AsyncStorage.getItem('groups');
      if (savedGroups) setGroups(JSON.parse(savedGroups));
      
      const savedGuardian = await AsyncStorage.getItem('guardianObjects');
      if (savedGuardian) setGuardianObjects(JSON.parse(savedGuardian));
      
      const savedSafeZones = await AsyncStorage.getItem('safeZones');
      if (savedSafeZones) setSafeZones(JSON.parse(savedSafeZones));
      
      const savedEnterprise = await AsyncStorage.getItem('enterpriseData');
      if (savedEnterprise) setEnterpriseData(JSON.parse(savedEnterprise));
      
      const savedGovernment = await AsyncStorage.getItem('governmentData');
      if (savedGovernment) setGovernmentData(JSON.parse(savedGovernment));
      
      const savedSubscription = await AsyncStorage.getItem('subscription');
      if (savedSubscription) setSubscription(JSON.parse(savedSubscription));
      
      const savedSocial = await AsyncStorage.getItem('socialData');
      if (savedSocial) setSocialData(JSON.parse(savedSocial));
      
      const savedLifeServices = await AsyncStorage.getItem('lifeServices');
      if (savedLifeServices) setLifeServices(JSON.parse(savedLifeServices));
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  // 保存函数
  const saveAppMode = async (mode) => {
    setAppMode(mode);
    await AsyncStorage.setItem('appMode', mode);
  };

  const saveDefaultNavigation = async (nav) => {
    setDefaultNavigation(nav);
    await AsyncStorage.setItem('defaultNavigation', nav);
  };

  const saveSettings = async (newSettings) => {
    setSettings(newSettings);
    await AsyncStorage.setItem('settings', JSON.stringify(newSettings));
  };

  const savePrivacySettings = async (newPrivacy) => {
    setPrivacySettings(newPrivacy);
    await AsyncStorage.setItem('privacySettings', JSON.stringify(newPrivacy));
  };

  const setSosContactsList = async (contacts) => {
    setSosContacts(contacts);
    await AsyncStorage.setItem('sosContacts', JSON.stringify(contacts));
  };
  
  const saveSosSettings = async (newSettings) => {
    setSosSettings(newSettings);
    await AsyncStorage.setItem('sosSettings', JSON.stringify(newSettings));
  };

  // 联系人管理
  const addContact = async (contact) => {
    const newContacts = [...contacts, { ...contact, id: Date.now().toString() }];
    setContacts(newContacts);
    await AsyncStorage.setItem('contacts', JSON.stringify(newContacts));
  };

  const updateContact = async (contactId, updates) => {
    const newContacts = contacts.map(c => 
      c.id === contactId ? { ...c, ...updates } : c
    );
    setContacts(newContacts);
    await AsyncStorage.setItem('contacts', JSON.stringify(newContacts));
  };

  const deleteContact = async (contactId) => {
    const newContacts = contacts.filter(c => c.id !== contactId);
    setContacts(newContacts);
    await AsyncStorage.setItem('contacts', JSON.stringify(newContacts));
  };
  
  const batchDeleteContacts = async (contactIds) => {
    const newContacts = contacts.filter(c => !contactIds.includes(c.id));
    setContacts(newContacts);
    await AsyncStorage.setItem('contacts', JSON.stringify(newContacts));
  };
  
  const batchUpdateContacts = async (contactIds, updates) => {
    const newContacts = contacts.map(c => 
      contactIds.includes(c.id) ? { ...c, ...updates } : c
    );
    setContacts(newContacts);
    await AsyncStorage.setItem('contacts', JSON.stringify(newContacts));
  };

  const updateContactLastContact = async (contactId) => {
    const newContacts = contacts.map(c => 
      c.id === contactId ? { ...c, lastContact: Date.now() } : c
    );
    setContacts(newContacts);
    await AsyncStorage.setItem('contacts', JSON.stringify(newContacts));
  };

  // 时空标签管理
  const addSpatiotemporalTag = async (tag) => {
    const newTags = [...spatiotemporalTags, { ...tag, id: `tag-${Date.now()}` }];
    setSpatiotemporalTags(newTags);
    await AsyncStorage.setItem('spatiotemporalTags', JSON.stringify(newTags));
  };

  const updateSpatiotemporalTag = async (tagId, updates) => {
    const newTags = spatiotemporalTags.map(t => 
      t.id === tagId ? { ...t, ...updates } : t
    );
    setSpatiotemporalTags(newTags);
    await AsyncStorage.setItem('spatiotemporalTags', JSON.stringify(newTags));
  };

  const deleteSpatiotemporalTag = async (tagId) => {
    const newTags = spatiotemporalTags.filter(t => t.id !== tagId);
    setSpatiotemporalTags(newTags);
    await AsyncStorage.setItem('spatiotemporalTags', JSON.stringify(newTags));
  };

  // 分组管理
  const addGroup = async (group) => {
    const newGroups = [...groups, { ...group, id: `group-${Date.now()}` }];
    setGroups(newGroups);
    await AsyncStorage.setItem('groups', JSON.stringify(newGroups));
  };

  const updateGroup = async (groupId, updates) => {
    const newGroups = groups.map(g => 
      g.id === groupId ? { ...g, ...updates } : g
    );
    setGroups(newGroups);
    await AsyncStorage.setItem('groups', JSON.stringify(newGroups));
  };

  const deleteGroup = async (groupId) => {
    const newGroups = groups.filter(g => g.id !== groupId);
    setGroups(newGroups);
    await AsyncStorage.setItem('groups', JSON.stringify(newGroups));
  };

  // 亲情守护管理
  const addGuardianObject = async (obj) => {
    const newObjects = [...guardianObjects, { ...obj, id: `guard-${Date.now()}` }];
    setGuardianObjects(newObjects);
    await AsyncStorage.setItem('guardianObjects', JSON.stringify(newObjects));
  };

  const updateGuardianObject = async (id, updates) => {
    const newObjects = guardianObjects.map(o => 
      o.id === id ? { ...o, ...updates } : o
    );
    setGuardianObjects(newObjects);
    await AsyncStorage.setItem('guardianObjects', JSON.stringify(newObjects));
  };

  const deleteGuardianObject = async (id) => {
    const newObjects = guardianObjects.filter(o => o.id !== id);
    setGuardianObjects(newObjects);
    await AsyncStorage.setItem('guardianObjects', JSON.stringify(newObjects));
  };

  // 安全区域管理
  const addSafeZone = async (zone) => {
    const newZones = [...safeZones, { ...zone, id: `zone-${Date.now()}` }];
    setSafeZones(newZones);
    await AsyncStorage.setItem('safeZones', JSON.stringify(newZones));
  };

  const updateSafeZone = async (id, updates) => {
    const newZones = safeZones.map(z => 
      z.id === id ? { ...z, ...updates } : z
    );
    setSafeZones(newZones);
    await AsyncStorage.setItem('safeZones', JSON.stringify(newZones));
  };

  const deleteSafeZone = async (id) => {
    const newZones = safeZones.filter(z => z.id !== id);
    setSafeZones(newZones);
    await AsyncStorage.setItem('safeZones', JSON.stringify(newZones));
  };

  // 企业数据管理
  const updateEnterpriseData = async (updates) => {
    const newData = { ...enterpriseData, ...updates };
    setEnterpriseData(newData);
    await AsyncStorage.setItem('enterpriseData', JSON.stringify(newData));
  };

  const addDepartment = async (department) => {
    const newDepts = [...enterpriseData.departments, { ...department, id: `dept-${Date.now()}` }];
    const newData = { ...enterpriseData, departments: newDepts };
    setEnterpriseData(newData);
    await AsyncStorage.setItem('enterpriseData', JSON.stringify(newData));
  };

  const updateDepartment = async (deptId, updates) => {
    const newDepts = enterpriseData.departments.map(d => 
      d.id === deptId ? { ...d, ...updates } : d
    );
    const newData = { ...enterpriseData, departments: newDepts };
    setEnterpriseData(newData);
    await AsyncStorage.setItem('enterpriseData', JSON.stringify(newData));
  };

  const deleteDepartment = async (deptId) => {
    const newDepts = enterpriseData.departments.filter(d => d.id !== deptId);
    const newData = { ...enterpriseData, departments: newDepts };
    setEnterpriseData(newData);
    await AsyncStorage.setItem('enterpriseData', JSON.stringify(newData));
  };

  const addEmployee = async (employee) => {
    const newEmployees = [...enterpriseData.employees, { ...employee, id: `emp-${Date.now()}` }];
    const newData = { ...enterpriseData, employees: newEmployees };
    setEnterpriseData(newData);
    await AsyncStorage.setItem('enterpriseData', JSON.stringify(newData));
  };

  const updateEmployee = async (empId, updates) => {
    const newEmployees = enterpriseData.employees.map(e => 
      e.id === empId ? { ...e, ...updates } : e
    );
    const newData = { ...enterpriseData, employees: newEmployees };
    setEnterpriseData(newData);
    await AsyncStorage.setItem('enterpriseData', JSON.stringify(newData));
  };

  const deleteEmployee = async (empId) => {
    const newEmployees = enterpriseData.employees.filter(e => e.id !== empId);
    const newData = { ...enterpriseData, employees: newEmployees };
    setEnterpriseData(newData);
    await AsyncStorage.setItem('enterpriseData', JSON.stringify(newData));
  };

  const addCustomer = async (customer) => {
    const newCustomers = [...enterpriseData.customers, { ...customer, id: `cust-${Date.now()}` }];
    const newData = { ...enterpriseData, customers: newCustomers };
    setEnterpriseData(newData);
    await AsyncStorage.setItem('enterpriseData', JSON.stringify(newData));
  };

  const updateCustomer = async (custId, updates) => {
    const newCustomers = enterpriseData.customers.map(c => 
      c.id === custId ? { ...c, ...updates } : c
    );
    const newData = { ...enterpriseData, customers: newCustomers };
    setEnterpriseData(newData);
    await AsyncStorage.setItem('enterpriseData', JSON.stringify(newData));
  };

  const deleteCustomer = async (custId) => {
    const newCustomers = enterpriseData.customers.filter(c => c.id !== custId);
    const newData = { ...enterpriseData, customers: newCustomers };
    setEnterpriseData(newData);
    await AsyncStorage.setItem('enterpriseData', JSON.stringify(newData));
  };

  const addCheckInRecord = async (record) => {
    const newRecords = [...enterpriseData.checkInRecords, { ...record, id: `check-${Date.now()}` }];
    const newData = { ...enterpriseData, checkInRecords: newRecords };
    setEnterpriseData(newData);
    await AsyncStorage.setItem('enterpriseData', JSON.stringify(newData));
  };
  
  // 外勤任务管理
  const addFieldTask = async (task) => {
    const newTasks = [...enterpriseData.fieldTasks, { ...task, id: `task-${Date.now()}` }];
    const newData = { ...enterpriseData, fieldTasks: newTasks };
    setEnterpriseData(newData);
    await AsyncStorage.setItem('enterpriseData', JSON.stringify(newData));
  };
  
  const updateFieldTask = async (taskId, updates) => {
    const newTasks = enterpriseData.fieldTasks.map(t => 
      t.id === taskId ? { ...t, ...updates } : t
    );
    const newData = { ...enterpriseData, fieldTasks: newTasks };
    setEnterpriseData(newData);
    await AsyncStorage.setItem('enterpriseData', JSON.stringify(newData));
  };
  
  // 客户互动记录
  const addCustomerInteraction = async (interaction) => {
    const newInteractions = [...enterpriseData.customerInteractions, { ...interaction, id: `inter-${Date.now()}` }];
    const newData = { ...enterpriseData, customerInteractions: newInteractions };
    setEnterpriseData(newData);
    await AsyncStorage.setItem('enterpriseData', JSON.stringify(newData));
  };
  
  // 政企数据管理
  const updateGovernmentData = async (updates) => {
    const newData = { ...governmentData, ...updates };
    setGovernmentData(newData);
    await AsyncStorage.setItem('governmentData', JSON.stringify(newData));
  };
  
  const addGovDepartment = async (department) => {
    const newDepts = [...governmentData.departments, { ...department, id: `gov-dept-${Date.now()}` }];
    const newData = { ...governmentData, departments: newDepts };
    setGovernmentData(newData);
    await AsyncStorage.setItem('governmentData', JSON.stringify(newData));
  };
  
  const addGovPersonnel = async (personnel) => {
    const newPersonnel = [...governmentData.personnel, { ...personnel, id: `gov-emp-${Date.now()}` }];
    const newData = { ...governmentData, personnel: newPersonnel };
    setGovernmentData(newData);
    await AsyncStorage.setItem('governmentData', JSON.stringify(newData));
  };
  
  const addControlZone = async (zone) => {
    const newZones = [...governmentData.controlZones, { ...zone, id: `ctrl-zone-${Date.now()}` }];
    const newData = { ...governmentData, controlZones: newZones };
    setGovernmentData(newData);
    await AsyncStorage.setItem('governmentData', JSON.stringify(newData));
  };
  
  const addPatrolRecord = async (record) => {
    const newRecords = [...governmentData.patrolRecords, { ...record, id: `patrol-${Date.now()}` }];
    const newData = { ...governmentData, patrolRecords: newRecords };
    setGovernmentData(newData);
    await AsyncStorage.setItem('governmentData', JSON.stringify(newData));
  };

  // 订阅管理
  const subscribe = async (plan) => {
    const now = Date.now();
    let endDate;
    switch (plan.period) {
      case 'month':
        endDate = now + 30 * 24 * 60 * 60 * 1000;
        break;
      case 'quarter':
        endDate = now + 90 * 24 * 60 * 60 * 1000;
        break;
      case 'year':
        endDate = now + 365 * 24 * 60 * 60 * 1000;
        break;
      default:
        endDate = now + 30 * 24 * 60 * 60 * 1000;
    }
    const newSubscription = {
      plan: plan === SUBSCRIPTION_PLANS.monthly ? 'monthly' : 
            plan === SUBSCRIPTION_PLANS.quarterly ? 'quarterly' : 'yearly',
      startDate: now,
      endDate,
      autoRenew: true,
    };
    setSubscription(newSubscription);
    await AsyncStorage.setItem('subscription', JSON.stringify(newSubscription));
  };
  
  const cancelSubscription = async () => {
    const newSubscription = { ...subscription, plan: 'free', endDate: null, autoRenew: false };
    setSubscription(newSubscription);
    await AsyncStorage.setItem('subscription', JSON.stringify(newSubscription));
  };
  
  const toggleAutoRenew = async () => {
    const newSubscription = { ...subscription, autoRenew: !subscription.autoRenew };
    setSubscription(newSubscription);
    await AsyncStorage.setItem('subscription', JSON.stringify(newSubscription));
  };

  // 社交功能
  const addMoment = async (moment) => {
    const newMoments = [moment, ...socialData.moments];
    const newSocial = { ...socialData, moments: newMoments };
    setSocialData(newSocial);
    await AsyncStorage.setItem('socialData', JSON.stringify(newSocial));
  };
  
  const addInvitation = async (invitation) => {
    const newInvitations = [...socialData.invitations, { ...invitation, id: `inv-${Date.now()}` }];
    const newSocial = { ...socialData, invitations: newInvitations };
    setSocialData(newSocial);
    await AsyncStorage.setItem('socialData', JSON.stringify(newSocial));
  };

  // 账号注销
  const deleteAccount = async () => {
    try {
      await AsyncStorage.clear();
      setContacts(initialContacts);
      setSpatiotemporalTags(initialSpatiotemporalTags);
      setGroups([]);
      setGuardianObjects([]);
      setSafeZones([]);
      setEnterpriseData(initialEnterpriseData);
      setGovernmentData(initialGovernmentData);
      setSubscription({ plan: 'free', startDate: null, endDate: null, autoRenew: false });
      setSocialData({ friends: [], moments: [], invitations: [], nearbyStrangers: [] });
      setLifeServices({ favorites: [], travelRecords: [] });
      setPrivacySettings({
        agreedToPrivacyPolicy: false,
        agreedToUserAgreement: false,
        dataEncryption: true,
        autoBackup: false,
        locationMasking: false,
        contactMasking: false,
        authorizationLog: [],
      });
      return true;
    } catch (error) {
      console.error('Delete account error:', error);
      return false;
    }
  };
  
  // 获取当前订阅功能限制
  const getSubscriptionLimits = () => {
    const plan = SUBSCRIPTION_PLANS[subscription.plan] || SUBSCRIPTION_PLANS.free;
    return plan.features;
  };
  
  // 检查是否超出限制
  const checkLimit = (feature) => {
    const limits = getSubscriptionLimits();
    switch (feature) {
      case 'groups':
        return groups.length < limits.maxGroups;
      case 'tags':
        return spatiotemporalTags.length < limits.maxTags;
      case 'guardianObjects':
        return guardianObjects.length < limits.maxGuardianObjects;
      default:
        return true;
    }
  };

  return (
    <AppContext.Provider value={{
      // 应用模式
      appMode,
      saveAppMode,
      
      // 个人版数据
      contacts,
      spatiotemporalTags,
      groups,
      guardianObjects,
      safeZones,
      
      // 企业版数据
      enterpriseData,
      
      // 政企版数据
      governmentData,
      
      // 订阅
      subscription,
      subscribe,
      cancelSubscription,
      toggleAutoRenew,
      getSubscriptionLimits,
      checkLimit,
      SUBSCRIPTION_PLANS,
      
      // 社交数据
      socialData,
      addMoment,
      addInvitation,
      
      // 生活服务
      lifeServices,
      setLifeServices,
      
      // 通用设置
      defaultNavigation,
      settings,
      privacySettings,
      sosContacts,
      sosSettings,
      
      // 保存函数
      saveDefaultNavigation,
      saveSettings,
      savePrivacySettings,
      setSosContactsList,
      saveSosSettings,
      
      // 联系人管理
      addContact,
      updateContact,
      deleteContact,
      batchDeleteContacts,
      batchUpdateContacts,
      updateContactLastContact,
      
      // 时空标签管理
      addSpatiotemporalTag,
      updateSpatiotemporalTag,
      deleteSpatiotemporalTag,
      
      // 分组管理
      addGroup,
      updateGroup,
      deleteGroup,
      
      // 亲情守护管理
      addGuardianObject,
      updateGuardianObject,
      deleteGuardianObject,
      
      // 安全区域管理
      addSafeZone,
      updateSafeZone,
      deleteSafeZone,
      
      // 企业数据管理
      updateEnterpriseData,
      addDepartment,
      updateDepartment,
      deleteDepartment,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addCheckInRecord,
      addFieldTask,
      updateFieldTask,
      addCustomerInteraction,
      
      // 政企数据管理
      updateGovernmentData,
      addGovDepartment,
      addGovPersonnel,
      addControlZone,
      addPatrolRecord,
      
      // 账号管理
      deleteAccount,
      
      // 加密函数
      encryptData,
      decryptData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
