import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

// 初始联系人数据（空数组，联系人将从通讯录导入或用户手动添加）
const initialContacts = [];

const initialCategoryDimensions = {
  work: {
    label: '工作', color: 'blue', icon: 'briefcase',
    tree: [
      { id: 'w1', name: '进行中项目', color: 'blue', children: [
        { id: 'w1-1', name: 'Alpha项目', color: 'blue', children: [] },
        { id: 'w1-2', name: 'Beta平台', color: 'blue', children: [] },
        { id: 'w1-3', name: 'Gamma系统', color: 'blue', children: [] },
      ]},
      { id: 'w2', name: '组织架构', color: 'purple', children: [
        { id: 'w2-1', name: '技术委员会', color: 'purple', children: [] },
        { id: 'w2-2', name: '产品部', color: 'purple', children: [] },
        { id: 'w2-3', name: '市场部', color: 'purple', children: [] },
      ]},
      { id: 'w3', name: '外部关系', color: 'orange', children: [
        { id: 'w3-1', name: '核心客户', color: 'orange', children: [] },
        { id: 'w3-2', name: '供应商', color: 'orange', children: [] },
        { id: 'w3-3', name: '合作伙伴', color: 'orange', children: [] },
      ]},
    ],
  },
  personal: {
    label: '私人', color: 'green', icon: 'user-friends',
    tree: [
      { id: 'p1', name: '同学', color: 'green', children: [
        { id: 'p1-1', name: '小学同学', color: 'green', children: [] },
        { id: 'p1-2', name: '初中同学', color: 'green', children: [] },
        { id: 'p1-3', name: '高中同学', color: 'green', children: [] },
        { id: 'p1-4', name: '大学同学', color: 'green', children: [] },
      ]},
      { id: 'p2', name: '活动圈子', color: 'pink', children: [
        { id: 'p2-1', name: 'KK郊游团', color: 'pink', children: [] },
        { id: 'p2-2', name: '读书会', color: 'pink', children: [] },
        { id: 'p2-3', name: '羽毛球俱乐部', color: 'pink', children: [] },
      ]},
      { id: 'p3', name: '亲友', color: 'red', children: [
        { id: 'p3-1', name: '直系亲属', color: 'red', children: [] },
        { id: 'p3-2', name: '旁系亲属', color: 'red', children: [] },
        { id: 'p3-3', name: '密友', color: 'red', children: [] },
      ]},
    ],
  },
  custom: { label: '自定义', color: 'slate', icon: 'tags', tree: [] },
};

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
  const [settings, setSettings] = useState({ location: true, stealth: false, ai: true, dark: true });
  const [sosContacts, setSosContacts] = useState([
    { name: '父亲', phone: '13800000001' },
    { name: '母亲', phone: '13900000002' },
    { name: '紧急联系人', phone: '110' },
  ]);
  const [loaded, setLoaded] = useState(false);

  // 加载持久化数据
  useEffect(() => {
    (async () => {
      try {
        const savedContacts = await AsyncStorage.getItem('contacts');
        if (savedContacts) setContacts(JSON.parse(savedContacts));

        const savedCats = await AsyncStorage.getItem('categoryDimensions');
        if (savedCats) setCategoryDimensions(JSON.parse(savedCats));

        const savedNav = await AsyncStorage.getItem('defaultNavigation');
        if (savedNav) setDefaultNavigation(savedNav);

        const savedSettings = await AsyncStorage.getItem('settings');
        if (savedSettings) setSettings(JSON.parse(savedSettings));

        const savedSos = await AsyncStorage.getItem('sosContacts');
        if (savedSos) setSosContacts(JSON.parse(savedSos));
      } catch (e) { console.warn('Load error:', e); }
      setLoaded(true);
    })();
  }, []);

  // 联系人变化时自动持久化
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem('contacts', JSON.stringify(contacts)).catch(() => {});
  }, [contacts, loaded]);

  // 分类变化时自动持久化
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem('categoryDimensions', JSON.stringify(categoryDimensions)).catch(() => {});
  }, [categoryDimensions, loaded]);

  const saveDefaultNavigation = async (nav) => {
    setDefaultNavigation(nav);
    await AsyncStorage.setItem('defaultNavigation', nav);
  };

  const saveSettings = async (newSettings) => {
    setSettings(newSettings);
    await AsyncStorage.setItem('settings', JSON.stringify(newSettings));
  };

  const saveSosContacts = async (newSos) => {
    setSosContacts(newSos);
    await AsyncStorage.setItem('sosContacts', JSON.stringify(newSos));
  };

  const updateContactLastContact = (contactId) => {
    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, lastContact: Date.now() } : c));
  };

  const addContact = (contact) => {
    setContacts(prev => [...prev, { ...contact, id: Date.now().toString() }]);
  };

  const addContacts = (newContacts) => {
    setContacts(prev => [...prev, ...newContacts]);
  };

  const updateContact = (contactId, updates) => {
    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, ...updates } : c));
  };

  const deleteContact = (contactId) => {
    setContacts(prev => prev.filter(c => c.id !== contactId));
  };

  const addCategory = (dimension, parentId, category) => {
    setCategoryDimensions(prev => {
      const newDims = { ...prev };
      const dim = newDims[dimension];
      if (!parentId) {
        dim.tree.push({ ...category, id: dimension + '-' + Date.now(), children: [] });
      } else {
        const findAndAdd = (nodes) => {
          for (const node of nodes) {
            if (node.id === parentId) {
              if (!node.children) node.children = [];
              node.children.push({ ...category, id: dimension + '-' + Date.now(), children: [] });
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
          if (node.id === categoryId) { Object.assign(node, updates); return true; }
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
        if (index !== -1) { nodes.splice(index, 1); return true; }
        for (const node of nodes) { if (node.children && removeNode(node.children)) return true; }
        return false;
      };
      removeNode(dim.tree);
      return newDims;
    });
    setContacts(prev => prev.map(contact => ({
      ...contact,
      categories: contact.categories.filter(cat => !(cat.dim === dimension && cat.nodeId === categoryId))
    })));
  };

  return (
    <AppContext.Provider value={{
      contacts, categoryDimensions, defaultNavigation, settings, sosContacts, loaded,
      setSosContacts, saveDefaultNavigation, saveSettings, saveSosContacts,
      updateContactLastContact, addContact, addContacts, updateContact, deleteContact,
      addCategory, updateCategory, deleteCategory,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
