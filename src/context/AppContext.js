import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

// 初始联系人数据
const initialContacts = [
  {
    id: '1',
    name: '张三',
    phone: '13800000001',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang',
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
  },
  {
    id: '2',
    name: '李四',
    phone: '13900000002',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Li',
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
  },
  {
    id: '3',
    name: '王五',
    phone: '13700000003',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wang',
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
  },
  {
    id: '4',
    name: '赵六',
    phone: '13600000004',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhao',
    distance: 5.2,
    distanceUnit: 'km',
    relationship: 2,
    status: 'offline',
    location: '首都机场',
    latitude: 40.0799,
    longitude: 116.6031,
    isFavorite: false,
    context: '出差中',
    bestTime: '不建议打扰',
    lastContact: Date.now() - 7 * 24 * 60 * 60 * 1000,
    categories: [{ dim: 'work', nodeId: 'w1-3', path: ['进行中项目', 'Gamma系统'] }],
    tags: ['项目经理'],
  },
  {
    id: '5',
    name: '陈小明',
    phone: '13500000005',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chen',
    distance: 1.2,
    distanceUnit: 'km',
    relationship: 4,
    status: 'online',
    location: '朝阳公园',
    latitude: 39.9345,
    longitude: 116.4856,
    isFavorite: true,
    context: '正在打球',
    bestTime: '17:00后',
    lastContact: Date.now() - 30 * 60 * 1000,
    categories: [
      { dim: 'personal', nodeId: 'p1-3', path: ['同学', '高中同学'] },
      { dim: 'personal', nodeId: 'p2-3', path: ['活动圈子', '羽毛球俱乐部'] },
      { dim: 'work', nodeId: 'w2-2', path: ['组织架构', '产品组'] },
    ],
    tags: ['班长', '产品经理'],
  },
  {
    id: '6',
    name: '刘大伟',
    phone: '13300000006',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liu',
    distance: 3.0,
    distanceUnit: 'km',
    relationship: 3,
    status: 'online',
    location: '国贸三期',
    latitude: 39.9078,
    longitude: 116.4645,
    isFavorite: false,
    context: '会议中',
    bestTime: '19:00后',
    lastContact: Date.now() - 1 * 60 * 60 * 1000,
    categories: [
      { dim: 'work', nodeId: 'w1-1', path: ['进行中项目', 'Alpha项目'] },
      { dim: 'work', nodeId: 'w1-2', path: ['进行中项目', 'Beta平台'] },
    ],
    tags: ['全栈工程师'],
  },
  {
    id: '7',
    name: '林小红',
    phone: '13000000007',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lin',
    distance: 0.3,
    distanceUnit: 'km',
    relationship: 4,
    status: 'busy',
    location: '星巴克',
    latitude: 39.9139,
    longitude: 116.4475,
    isFavorite: true,
    context: '喝咖啡',
    bestTime: '14:00后',
    lastContact: Date.now() - 15 * 60 * 1000,
    categories: [
      { dim: 'personal', nodeId: 'p1-2', path: ['同学', '初中同学'] },
      { dim: 'personal', nodeId: 'p2-1', path: ['活动圈子', 'KK郊游群'] },
    ],
    tags: ['同桌', '摄影师'],
  },
  {
    id: '8',
    name: '周总',
    phone: '13888888888',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhou',
    distance: 12.0,
    distanceUnit: 'km',
    relationship: 5,
    status: 'online',
    location: '总部大楼',
    latitude: 40.0012,
    longitude: 116.3912,
    isFavorite: true,
    context: '重要客户',
    bestTime: '提前预约',
    lastContact: Date.now() - 3 * 24 * 60 * 60 * 1000,
    categories: [
      { dim: 'work', nodeId: 'w3-1', path: ['外部关系', '核心客户'] },
      { dim: 'work', nodeId: 'w2-1', path: ['组织架构', '技术委员会'] },
    ],
    tags: ['CTO', '决策人'],
  },
];

// 分类数据结构
const initialCategoryDimensions = {
  work: {
    label: '工作',
    color: 'blue',
    icon: 'briefcase',
    tree: [
      {
        id: 'w1',
        name: '进行中项目',
        color: 'blue',
        children: [
          { id: 'w1-1', name: 'Alpha项目', color: 'blue', children: [] },
          { id: 'w1-2', name: 'Beta平台', color: 'blue', children: [] },
          { id: 'w1-3', name: 'Gamma系统', color: 'blue', children: [] },
        ],
      },
      {
        id: 'w2',
        name: '组织架构',
        color: 'purple',
        children: [
          { id: 'w2-1', name: '技术委员会', color: 'purple', children: [] },
          { id: 'w2-2', name: '产品组', color: 'purple', children: [] },
          { id: 'w2-3', name: '市场部', color: 'purple', children: [] },
        ],
      },
      {
        id: 'w3',
        name: '外部关系',
        color: 'orange',
        children: [
          { id: 'w3-1', name: '核心客户', color: 'orange', children: [] },
          { id: 'w3-2', name: '供应商', color: 'orange', children: [] },
          { id: 'w3-3', name: '合作伙伴', color: 'orange', children: [] },
        ],
      },
    ],
  },
  personal: {
    label: '私人',
    color: 'green',
    icon: 'user-friends',
    tree: [
      {
        id: 'p1',
        name: '同学',
        color: 'green',
        children: [
          { id: 'p1-1', name: '小学同学', color: 'green', children: [] },
          { id: 'p1-2', name: '初中同学', color: 'green', children: [] },
          { id: 'p1-3', name: '高中同学', color: 'green', children: [] },
          { id: 'p1-4', name: '大学同学', color: 'green', children: [] },
        ],
      },
      {
        id: 'p2',
        name: '活动圈子',
        color: 'pink',
        children: [
          { id: 'p2-1', name: 'KK郊游群', color: 'pink', children: [] },
          { id: 'p2-2', name: '读书会', color: 'pink', children: [] },
          { id: 'p2-3', name: '羽毛球俱乐部', color: 'pink', children: [] },
        ],
      },
      {
        id: 'p3',
        name: '亲友',
        color: 'red',
        children: [
          { id: 'p3-1', name: '直系亲属', color: 'red', children: [] },
          { id: 'p3-2', name: '旁系亲属', color: 'red', children: [] },
          { id: 'p3-3', name: '密友', color: 'red', children: [] },
        ],
      },
    ],
  },
  custom: {
    label: '自定义',
    color: 'slate',
    icon: 'tags',
    tree: [],
  },
};

// 支持的导航应用
export const NAVIGATION_APPS = {
  amap: { name: '高德地图', package: 'com.autonavi.minimap', scheme: 'amapuri://route/plan/' },
  baidu: { name: '百度地图', package: 'com.baidu.BaiduMap', scheme: 'baidumap://map/direction' },
  tencent: { name: '腾讯地图', package: 'com.tencent.map', scheme: 'qqmap://map/routeplan' },
  google: { name: 'Google地图', package: 'com.google.android.apps.maps', scheme: 'comgooglemaps://' },
  system: { name: '系统默认', package: '', scheme: 'geo:' },
};

export function AppProvider({ children }) {
  const [contacts, setContacts] = useState(initialContacts);
  const [categoryDimensions, setCategoryDimensions] = useState(initialCategoryDimensions);
  const [defaultNavigation, setDefaultNavigation] = useState('amap');
  const [settings, setSettings] = useState({
    location: true,
    stealth: false,
    ai: true,
    dark: true,
  });
  const [sosContacts, setSosContacts] = useState([
    { name: '父亲', phone: '13800000001' },
    { name: '母亲', phone: '13900000002' },
    { name: '紧急联系人', phone: '110' },
  ]);

  // 加载保存的设置
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedNav = await AsyncStorage.getItem('defaultNavigation');
      if (savedNav) setDefaultNavigation(savedNav);
      
      const savedSettings = await AsyncStorage.getItem('settings');
      if (savedSettings) setSettings(JSON.parse(savedSettings));
      
      const savedSos = await AsyncStorage.getItem('sosContacts');
      if (savedSos) setSosContacts(JSON.parse(savedSos));
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const saveDefaultNavigation = async (nav) => {
    setDefaultNavigation(nav);
    await AsyncStorage.setItem('defaultNavigation', nav);
  };

  const saveSettings = async (newSettings) => {
    setSettings(newSettings);
    await AsyncStorage.setItem('settings', JSON.stringify(newSettings));
  };

  const updateContactLastContact = (contactId) => {
    setContacts(prev => prev.map(c => 
      c.id === contactId ? { ...c, lastContact: Date.now() } : c
    ));
  };

  const addContact = (contact) => {
    setContacts(prev => [...prev, { ...contact, id: Date.now().toString() }]);
  };

  const updateContact = (contactId, updates) => {
    setContacts(prev => prev.map(c => 
      c.id === contactId ? { ...c, ...updates } : c
    ));
  };

  const deleteContact = (contactId) => {
    setContacts(prev => prev.filter(c => c.id !== contactId));
  };

  const addCategory = (dimension, parentId, category) => {
    setCategoryDimensions(prev => {
      const newDims = { ...prev };
      const dim = newDims[dimension];
      
      if (!parentId) {
        dim.tree.push({ ...category, id: `${dimension}-${Date.now()}`, children: [] });
      } else {
        const findAndAdd = (nodes) => {
          for (const node of nodes) {
            if (node.id === parentId) {
              if (!node.children) node.children = [];
              node.children.push({ ...category, id: `${dimension}-${Date.now()}`, children: [] });
              return true;
            }
            if (node.children && findAndAdd(node.children)) return true;
          }
          return false;
        };
        findAndAdd(dim.tree);
      }
      return newDims;
    });
  };

  const updateCategory = (dimension, categoryId, updates) => {
    setCategoryDimensions(prev => {
      const newDims = { ...prev };
      const dim = newDims[dimension];
      
      const findAndUpdate = (nodes) => {
        for (const node of nodes) {
          if (node.id === categoryId) {
            Object.assign(node, updates);
            return true;
          }
          if (node.children && findAndUpdate(node.children)) return true;
        }
        return false;
      };
      findAndUpdate(dim.tree);
      return newDims;
    });
  };

  const deleteCategory = (dimension, categoryId) => {
    setCategoryDimensions(prev => {
      const newDims = { ...prev };
      const dim = newDims[dimension];
      
      const removeNode = (nodes) => {
        const index = nodes.findIndex(n => n.id === categoryId);
        if (index !== -1) {
          nodes.splice(index, 1);
          return true;
        }
        for (const node of nodes) {
          if (node.children && removeNode(node.children)) return true;
        }
        return false;
      };
      removeNode(dim.tree);
      return newDims;
    });

    // 同时从联系人中移除该分类
    setContacts(prev => prev.map(contact => ({
      ...contact,
      categories: contact.categories.filter(cat => !(cat.dim === dimension && cat.nodeId === categoryId))
    })));
  };

  return (
    <AppContext.Provider value={{
      contacts,
      categoryDimensions,
      defaultNavigation,
      settings,
      sosContacts,
      setSosContacts,
      saveDefaultNavigation,
      saveSettings,
      updateContactLastContact,
      addContact,
      updateContact,
      deleteContact,
      addCategory,
      updateCategory,
      deleteCategory,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
