import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp, NAVIGATION_APPS } from '../../context/AppContext';

const ProfileScreen = ({ navigation }) => {
  const { 
    contacts, 
    settings, 
    saveSettings, 
    privacySettings, 
    savePrivacySettings,
    defaultNavigation,
    saveDefaultNavigation,
    deleteAccount,
    appMode,
    saveAppMode,
  } = useApp();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const stats = {
    total: contacts.length,
    favorites: contacts.filter(c => c.isFavorite).length,
    recent: contacts.filter(c => c.lastContact && (Date.now() - c.lastContact < 7 * 24 * 60 * 60 * 1000)).length,
  };

  const handleDeleteAccount = async () => {
    const success = await deleteAccount();
    if (success) {
      Alert.alert('账号已注销', '所有数据已删除');
    }
  };

  const menuItems = [
    { icon: 'map-marked-alt', title: '默认导航设置', subtitle: NAVIGATION_APPS[defaultNavigation]?.name, color: '#3b82f6', onPress: () => navigation.navigate('NavigationSettings') },
    { icon: 'tags', title: '时空标签管理', subtitle: '管理标签', color: '#8b5cf6', onPress: () => navigation.navigate('TagManager') },
    { icon: 'object-group', title: '分组管理', subtitle: '管理分组', color: '#f59e0b', onPress: () => navigation.navigate('GroupManager') },
    { icon: 'shield-alt', title: '隐私政策', subtitle: '查看隐私政策', color: '#10b981', onPress: () => navigation.navigate('PrivacyPolicy') },
    { icon: 'file-contract', title: '用户协议', subtitle: '查看用户协议', color: '#64748b', onPress: () => navigation.navigate('UserAgreement') },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 用户信息 */}
      <View style={styles.userCard}>
        <View style={styles.userHeader}>
          <View style={styles.avatar}><Icon name="user" size={40} color="#fff" /></View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>我的通信录</Text>
            <Text style={styles.userSubtitle}>GeoContacts+ Pro</Text>
          </View>
          <View style={styles.modeBadge}>
            <Text style={styles.modeText}>{appMode === 'personal' ? '个人版' : '企业版'}</Text>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}><Text style={styles.statNumber}>{stats.total}</Text><Text style={styles.statLabel}>总联系人</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}><Text style={styles.statNumber}>{stats.favorites}</Text><Text style={styles.statLabel}>收藏</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}><Text style={styles.statNumber}>{stats.recent}</Text><Text style={styles.statLabel}>最近联系</Text></View>
        </View>
      </View>

      {/* 模式切换 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>应用模式</Text>
        <View style={styles.modeContainer}>
          <TouchableOpacity style={[styles.modeOption, appMode === 'personal' && styles.modeOptionActive]} onPress={() => saveAppMode('personal')}>
            <Icon name="user" size={20} color={appMode === 'personal' ? '#3b82f6' : '#94a3b8'} />
            <Text style={[styles.modeOptionText, appMode === 'personal' && styles.modeOptionTextActive]}>个人版</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modeOption, appMode === 'enterprise' && styles.modeOptionActive]} onPress={() => saveAppMode('enterprise')}>
            <Icon name="building" size={20} color={appMode === 'enterprise' ? '#10b981' : '#94a3b8'} />
            <Text style={[styles.modeOptionText, appMode === 'enterprise' && styles.modeOptionTextActive]}>企业版</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 快速设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>快速设置</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}><View style={[styles.settingIcon, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}><Icon name="map-marker-alt" size={16} color="#3b82f6" /></View><View><Text style={styles.settingTitle}>位置共享</Text><Text style={styles.settingSubtitle}>允许他人查看我的位置</Text></View></View>
            <Switch value={settings.location} onValueChange={(v) => saveSettings({ ...settings, location: v })} trackColor={{ false: '#334155', true: '#3b82f6' }} thumbColor="#fff" />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}><View style={[styles.settingIcon, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}><Icon name="ghost" size={16} color="#8b5cf6" /></View><View><Text style={styles.settingTitle}>隐身模式</Text><Text style={styles.settingSubtitle}>对他人隐藏在线状态</Text></View></View>
            <Switch value={settings.stealth} onValueChange={(v) => saveSettings({ ...settings, stealth: v })} trackColor={{ false: '#334155', true: '#8b5cf6' }} thumbColor="#fff" />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}><View style={[styles.settingIcon, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}><Icon name="robot" size={16} color="#10b981" /></View><View><Text style={styles.settingTitle}>AI 智能建议</Text><Text style={styles.settingSubtitle}>接收联系时间建议</Text></View></View>
            <Switch value={settings.ai} onValueChange={(v) => saveSettings({ ...settings, ai: v })} trackColor={{ false: '#334155', true: '#10b981' }} thumbColor="#fff" />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}><View style={[styles.settingIcon, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}><Icon name="moon" size={16} color="#f59e0b" /></View><View><Text style={styles.settingTitle}>深色模式</Text><Text style={styles.settingSubtitle}>使用深色主题</Text></View></View>
            <Switch value={settings.dark} onValueChange={(v) => saveSettings({ ...settings, dark: v })} trackColor={{ false: '#334155', true: '#f59e0b' }} thumbColor="#fff" />
          </View>
        </View>
      </View>

      {/* 功能菜单 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>功能</Text>
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <View key={item.title}>
              <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
                <View style={styles.menuLeft}><View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}><Icon name={item.icon} size={18} color={item.color} /></View><View><Text style={styles.menuTitle}>{item.title}</Text><Text style={styles.menuSubtitle}>{item.subtitle}</Text></View></View>
                <Icon name="chevron-right" size={14} color="#64748b" />
              </TouchableOpacity>
              {index < menuItems.length - 1 && <View style={styles.menuDivider} />}
            </View>
          ))}
        </View>
      </View>

      {/* 账号注销 */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.deleteButton} onPress={() => Alert.alert('注销账号', '确定要注销账号吗？所有数据将被删除！', [{ text: '取消', style: 'cancel' }, { text: '确定', style: 'destructive', onPress: handleDeleteAccount }])}>
          <Icon name="trash-alt" size={16} color="#ef4444" />
          <Text style={styles.deleteButtonText}>注销账号</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>GeoContacts+ Pro v1.0.0</Text>
        <Text style={styles.footerSubtext}>基于位置的智能通信录</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  userCard: { margin: 16, backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  userHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  userInfo: { flex: 1 },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  userSubtitle: { fontSize: 13, color: '#94a3b8' },
  modeBadge: { paddingHorizontal: 10, paddingVertical: 5, backgroundColor: 'rgba(59, 130, 246, 0.2)', borderRadius: 12 },
  modeText: { fontSize: 11, fontWeight: 'bold', color: '#3b82f6' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'rgba(15, 23, 42, 0.5)', borderRadius: 12, paddingVertical: 16 },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#64748b' },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255, 255, 255, 0.1)' },
  section: { marginHorizontal: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 12 },
  modeContainer: { flexDirection: 'row', gap: 12 },
  modeOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 12, gap: 8, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  modeOptionActive: { borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)' },
  modeOptionText: { fontSize: 14, fontWeight: '600', color: '#94a3b8' },
  modeOptionTextActive: { color: '#3b82f6' },
  settingsCard: { backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  settingIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  settingTitle: { fontSize: 14, fontWeight: '500', color: '#fff', marginBottom: 2 },
  settingSubtitle: { fontSize: 12, color: '#64748b' },
  menuCard: { backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  menuTitle: { fontSize: 14, fontWeight: '500', color: '#fff', marginBottom: 2 },
  menuSubtitle: { fontSize: 12, color: '#64748b' },
  menuDivider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)', marginHorizontal: 16 },
  deleteButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 12, paddingVertical: 14, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' },
  deleteButtonText: { fontSize: 14, fontWeight: '600', color: '#ef4444' },
  footer: { alignItems: 'center', paddingVertical: 24 },
  footerText: { fontSize: 13, color: '#64748b', marginBottom: 4 },
  footerSubtext: { fontSize: 11, color: '#475569' },
});

export default ProfileScreen;
