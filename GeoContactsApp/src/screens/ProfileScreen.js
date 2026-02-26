import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp, NAVIGATION_APPS } from '../context/AppContext';

const ProfileScreen = ({ navigation }) => {
  const {
    contacts,
    defaultNavigation,
    saveDefaultNavigation,
    settings,
    saveSettings,
    sosContacts,
  } = useApp();

  const [localSettings, setLocalSettings] = useState(settings);

  // 切换设置
  const toggleSetting = (key) => {
    const newSettings = { ...localSettings, [key]: !localSettings[key] };
    setLocalSettings(newSettings);
    saveSettings(newSettings);
  };

  // 统计信息
  const stats = {
    total: contacts.length,
    work: contacts.filter(c => c.categories.some(cat => cat.dim === 'work')).length,
    personal: contacts.filter(c => c.categories.some(cat => cat.dim === 'personal')).length,
    favorite: contacts.filter(c => c.isFavorite).length,
  };

  // 菜单项
  const menuItems = [
    {
      id: 'navigation',
      icon: 'map-marked-alt',
      title: '默认导航设置',
      subtitle: NAVIGATION_APPS[defaultNavigation]?.name || '高德地图',
      onPress: () => navigation.navigate('NavigationSettings'),
      color: '#3b82f6',
    },
    {
      id: 'category',
      icon: 'sitemap',
      title: '分类管理',
      subtitle: '管理工作/私人分类',
      onPress: () => navigation.navigate('CategoryManager'),
      color: '#8b5cf6',
    },
    {
      id: 'sos',
      icon: 'exclamation-triangle',
      title: 'SOS紧急联系人',
      subtitle: `${sosContacts.length}位紧急联系人`,
      onPress: () => Alert.alert('提示', 'SOS联系人设置功能开发中'),
      color: '#ef4444',
    },
    {
      id: 'backup',
      icon: 'cloud-upload-alt',
      title: '数据备份',
      subtitle: '上次备份: 从未',
      onPress: () => Alert.alert('提示', '数据备份功能开发中'),
      color: '#10b981',
    },
    {
      id: 'help',
      icon: 'question-circle',
      title: '帮助与反馈',
      subtitle: '使用指南、问题反馈',
      onPress: () => Alert.alert('提示', '帮助中心功能开发中'),
      color: '#f59e0b',
    },
    {
      id: 'about',
      icon: 'info-circle',
      title: '关于',
      subtitle: '版本 1.0.0',
      onPress: () => Alert.alert('关于 GeoContacts+', '版本 1.0.0\n基于位置的智能通信录'),
      color: '#64748b',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 用户信息卡片 */}
      <View style={styles.userCard}>
        <View style={styles.userHeader}>
          <View style={styles.avatar}>
            <Icon name="user" size={40} color="#fff" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>我的通信录</Text>
            <Text style={styles.userSubtitle}>GeoContacts+ 会员</Text>
          </View>
          <View style={styles.vipBadge}>
            <Icon name="crown" size={12} color="#fbbf24" />
            <Text style={styles.vipText}>VIP</Text>
          </View>
        </View>

        {/* 统计信息 */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>总联系人</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.work}</Text>
            <Text style={styles.statLabel}>工作</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.personal}</Text>
            <Text style={styles.statLabel}>私人</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.favorite}</Text>
            <Text style={styles.statLabel}>收藏</Text>
          </View>
        </View>
      </View>

      {/* 快速设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>快速设置</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                <Icon name="map-marker-alt" size={16} color="#3b82f6" />
              </View>
              <View>
                <Text style={styles.settingTitle}>位置共享</Text>
                <Text style={styles.settingSubtitle}>允许他人查看我的位置</Text>
              </View>
            </View>
            <Switch
              value={localSettings.location}
              onValueChange={() => toggleSetting('location')}
              trackColor={{ false: '#334155', true: '#3b82f6' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
                <Icon name="ghost" size={16} color="#8b5cf6" />
              </View>
              <View>
                <Text style={styles.settingTitle}>隐身模式</Text>
                <Text style={styles.settingSubtitle}>对他人隐藏在线状态</Text>
              </View>
            </View>
            <Switch
              value={localSettings.stealth}
              onValueChange={() => toggleSetting('stealth')}
              trackColor={{ false: '#334155', true: '#8b5cf6' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <Icon name="robot" size={16} color="#10b981" />
              </View>
              <View>
                <Text style={styles.settingTitle}>AI 智能建议</Text>
                <Text style={styles.settingSubtitle}>接收联系时间建议</Text>
              </View>
            </View>
            <Switch
              value={localSettings.ai}
              onValueChange={() => toggleSetting('ai')}
              trackColor={{ false: '#334155', true: '#10b981' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                <Icon name="moon" size={16} color="#f59e0b" />
              </View>
              <View>
                <Text style={styles.settingTitle}>深色模式</Text>
                <Text style={styles.settingSubtitle}>使用深色主题</Text>
              </View>
            </View>
            <Switch
              value={localSettings.dark}
              onValueChange={() => toggleSetting('dark')}
              trackColor={{ false: '#334155', true: '#f59e0b' }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </View>

      {/* 功能菜单 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>功能</Text>
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                    <Icon name={item.icon} size={18} color={item.color} />
                  </View>
                  <View>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={14} color="#64748b" />
              </TouchableOpacity>
              {index < menuItems.length - 1 && <View style={styles.menuDivider} />}
            </View>
          ))}
        </View>
      </View>

      {/* 底部信息 */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>GeoContacts+ v1.0.0</Text>
        <Text style={styles.footerSubtext}>基于位置的智能通信录</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  userCard: {
    margin: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  vipText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: 12,
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  settingDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 16,
  },
  menuCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 11,
    color: '#475569',
  },
});

export default ProfileScreen;
