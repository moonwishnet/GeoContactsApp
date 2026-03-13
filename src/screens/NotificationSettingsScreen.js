import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Switch, ActivityIndicator, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../context/AppContext';

// 平台特定的 Notifications 导入
let Notifications = null;
try {
  if (Platform.OS !== 'web') {
    Notifications = require('expo-notifications');
    // 设置通知处理器（仅在非 Web 平台）
    Notifications.setNotificationHandler({
      handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: true }),
    });
  }
} catch (e) {
  // Web 平台或导入失败时使用空实现
  Notifications = {
    getPermissionsAsync: async () => ({ status: 'undetermined' }),
    requestPermissionsAsync: async () => ({ status: 'undetermined' }),
    scheduleNotificationAsync: async () => {},
  };
}

const NotificationSettingsScreen = ({ navigation }) => {
  const { contacts } = useApp();
  const [permission, setPermission] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    contactReminder: true,
    nearbyAlert: false,
    sosAlert: true,
    quietHoursStart: '23:00',
    quietHoursEnd: '08:00',
    quietHoursEnabled: false,
  });

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setPermission(status === 'granted');
    } catch (e) {
      setPermission(false);
    }
    try {
      const val = await AsyncStorage.getItem('notificationSettings');
      if (val) setSettings(JSON.parse(val));
    } catch (e) {}
  };

  const requestPermission = async () => {
    setLoading(true);
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setPermission(status === 'granted');
      if (status !== 'granted') Alert.alert('提示', '请在系统设置中允许通知权限');
    } catch (e) {
      Alert.alert('提示', 'Web 平台不支持通知功能');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings) => {
    setSettings(newSettings);
    await AsyncStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  };

  const toggle = (key) => {
    saveSettings({ ...settings, [key]: !settings[key] });
  };

  const testNotification = async () => {
    try {
      if (Platform.OS === 'web') {
        Alert.alert('提示', 'Web 平台不支持通知功能');
        return;
      }
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔔 GeoContacts+ 测试通知',
          body: '通知功能正常工作！',
          data: { type: 'test' },
        },
        trigger: { seconds: 1 },
      });
    } catch (e) {
      Alert.alert('错误', e.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>消息推送通知</Text>
      </View>

      {/* 权限状态 */}
      <View style={[styles.permCard, permission ? styles.permGranted : styles.permDenied]}>
        <Icon name={permission ? 'bell' : 'bell-slash'} size={24} color={permission ? '#10b981' : '#ef4444'} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.permTitle}>{permission ? '通知已开启' : '通知未开启'}</Text>
          <Text style={styles.permSubtitle}>{permission ? '您将收到实时消息提醒' : '需要开启通知权限'}</Text>
        </View>
        {!permission && (
          <TouchableOpacity style={styles.permBtn} onPress={requestPermission} disabled={loading}>
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.permBtnText}>开启</Text>}
          </TouchableOpacity>
        )}
      </View>

      {/* 通知类型 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>通知类型</Text>
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={styles.switchLeft}>
              <View style={[styles.switchIcon, { backgroundColor: 'rgba(59,130,246,0.2)' }]}>
                <Icon name="user-clock" size={16} color="#3b82f6" />
              </View>
              <View>
                <Text style={styles.switchTitle}>联系提醒</Text>
                <Text style={styles.switchSubtitle}>AI建议联系时机提醒</Text>
              </View>
            </View>
            <Switch value={settings.contactReminder} onValueChange={() => toggle('contactReminder')} trackColor={{ false: '#334155', true: '#3b82f6' }} thumbColor="#fff" />
          </View>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <View style={styles.switchLeft}>
              <View style={[styles.switchIcon, { backgroundColor: 'rgba(16,185,129,0.2)' }]}>
                <Icon name="map-marker-alt" size={16} color="#10b981" />
              </View>
              <View>
                <Text style={styles.switchTitle}>附近联系人</Text>
                <Text style={styles.switchSubtitle}>联系人靠近时提醒</Text>
              </View>
            </View>
            <Switch value={settings.nearbyAlert} onValueChange={() => toggle('nearbyAlert')} trackColor={{ false: '#334155', true: '#10b981' }} thumbColor="#fff" />
          </View>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <View style={styles.switchLeft}>
              <View style={[styles.switchIcon, { backgroundColor: 'rgba(239,68,68,0.2)' }]}>
                <Icon name="exclamation-triangle" size={16} color="#ef4444" />
              </View>
              <View>
                <Text style={styles.switchTitle}>SOS紧急通知</Text>
                <Text style={styles.switchSubtitle}>接收SOS紧急求助通知</Text>
              </View>
            </View>
            <Switch value={settings.sosAlert} onValueChange={() => toggle('sosAlert')} trackColor={{ false: '#334155', true: '#ef4444' }} thumbColor="#fff" />
          </View>
        </View>
      </View>

      {/* 免打扰 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>免打扰</Text>
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={styles.switchLeft}>
              <View style={[styles.switchIcon, { backgroundColor: 'rgba(139,92,246,0.2)' }]}>
                <Icon name="moon" size={16} color="#8b5cf6" />
              </View>
              <View>
                <Text style={styles.switchTitle}>免打扰模式</Text>
                <Text style={styles.switchSubtitle}>{settings.quietHoursStart} - {settings.quietHoursEnd}</Text>
              </View>
            </View>
            <Switch value={settings.quietHoursEnabled} onValueChange={() => toggle('quietHoursEnabled')} trackColor={{ false: '#334155', true: '#8b5cf6' }} thumbColor="#fff" />
          </View>
        </View>
      </View>

      {/* 测试 */}
      {permission && Platform.OS !== 'web' && (
        <TouchableOpacity style={styles.testBtn} onPress={testNotification}>
          <Icon name="paper-plane" size={16} color="#fff" />
          <Text style={styles.testBtnText}>发送测试通知</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 56 },
  backBtn: { padding: 8, marginRight: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  permCard: { margin: 16, padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center' },
  permGranted: { backgroundColor: 'rgba(16,185,129,0.1)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.3)' },
  permDenied: { backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)' },
  permTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  permSubtitle: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  permBtn: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#3b82f6', borderRadius: 8 },
  permBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  section: { marginHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 12 },
  card: { backgroundColor: 'rgba(30,41,59,0.7)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  switchLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  switchIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  switchTitle: { fontSize: 14, fontWeight: '500', color: '#fff' },
  switchSubtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: 16 },
  testBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 16, padding: 14, backgroundColor: 'rgba(59,130,246,0.2)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(59,130,246,0.3)', gap: 8 },
  testBtnText: { fontSize: 14, color: '#fff', fontWeight: '600' },
});

export default NotificationSettingsScreen;
