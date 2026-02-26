import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../../context/AppContext';

const ProfileScreen = ({ navigation }) => {
  const { enterpriseData, settings, saveSettings, appMode, saveAppMode } = useApp();

  const menuItems = [
    { icon: 'map-marked-alt', title: '默认导航设置', color: '#3b82f6', onPress: () => navigation.navigate('NavigationSettings') },
    { icon: 'cog', title: '打卡设置', color: '#10b981', onPress: () => {} },
    { icon: 'shield-alt', title: '隐私政策', color: '#8b5cf6', onPress: () => navigation.navigate('PrivacyPolicy') },
    { icon: 'file-contract', title: '用户协议', color: '#64748b', onPress: () => navigation.navigate('UserAgreement') },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 企业信息 */}
      <View style={styles.companyCard}>
        <View style={styles.companyHeader}>
          <View style={styles.companyLogo}><Icon name="building" size={32} color="#3b82f6" /></View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{enterpriseData.companyName}</Text>
            <Text style={styles.companySubtitle}>管理员</Text>
          </View>
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

      {/* 设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>设置</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}><Icon name="bell" size={18} color="#3b82f6" /><Text style={styles.settingText}>推送通知</Text></View>
            <Switch value={settings.notification} onValueChange={(v) => saveSettings({ ...settings, notification: v })} trackColor={{ false: '#334155', true: '#3b82f6' }} thumbColor="#fff" />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}><Icon name="moon" size={18} color="#f59e0b" /><Text style={styles.settingText}>深色模式</Text></View>
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
                <View style={styles.menuLeft}><View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}><Icon name={item.icon} size={18} color={item.color} /></View><Text style={styles.menuTitle}>{item.title}</Text></View>
                <Icon name="chevron-right" size={14} color="#64748b" />
              </TouchableOpacity>
              {index < menuItems.length - 1 && <View style={styles.menuDivider} />}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>GeoContacts+ Pro 企业版 v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  companyCard: { margin: 16, backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  companyHeader: { flexDirection: 'row', alignItems: 'center' },
  companyLogo: { width: 56, height: 56, borderRadius: 12, backgroundColor: 'rgba(59, 130, 246, 0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  companyInfo: { flex: 1 },
  companyName: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  companySubtitle: { fontSize: 13, color: '#94a3b8' },
  section: { marginHorizontal: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 12 },
  modeContainer: { flexDirection: 'row', gap: 12 },
  modeOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 12, gap: 8, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  modeOptionActive: { borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)' },
  modeOptionText: { fontSize: 14, fontWeight: '600', color: '#94a3b8' },
  modeOptionTextActive: { color: '#3b82f6' },
  settingsCard: { backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingText: { fontSize: 15, color: '#fff' },
  menuCard: { backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  menuTitle: { fontSize: 14, fontWeight: '500', color: '#fff' },
  menuDivider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)', marginHorizontal: 16 },
  footer: { alignItems: 'center', paddingVertical: 24 },
  footerText: { fontSize: 13, color: '#64748b' },
});

export default ProfileScreen;
