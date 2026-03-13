import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator, FlatList } from 'react-native';
import * as Contacts from 'expo-contacts';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../context/AppContext';

const ContactSyncScreen = ({ navigation }) => {
  const { contacts, addContact, updateContact } = useApp();
  const [permission, setPermission] = useState(null);
  const [systemContacts, setSystemContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [synced, setSynced] = useState(0);
  const [skipped, setSkipped] = useState(0);

  useEffect(() => { requestPermission(); }, []);

  const requestPermission = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    setPermission(status === 'granted');
    if (status === 'granted') loadSystemContacts();
  };

  const loadSystemContacts = async () => {
    setLoading(true);
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
        pageSize: 200,
        pageOffset: 0,
      });
      const filtered = (data || []).filter(c => c.phoneNumbers && c.phoneNumbers.length > 0);
      setSystemContacts(filtered);
    } catch (e) {
      Alert.alert('错误', '无法读取系统联系人: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const syncContacts = () => {
    if (!systemContacts.length) return;
    let syncedCount = 0;
    let skippedCount = 0;

    for (const sc of systemContacts) {
      const phone = sc.phoneNumbers[0].number.replace(/[^\d+]/g, '');
      const existing = contacts.find(c => c.phone === phone);
      if (existing) {
        // 更新已有联系人信息
        updateContact(existing.id, {
          phone,
          name: sc.name || existing.name,
          avatar: existing.avatar,
        });
        skippedCount++;
      } else {
        addContact({
          name: sc.name || '未命名',
          phone,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(sc.name || phone),
          distance: 0,
          distanceUnit: 'km',
          relationship: 1,
          status: 'offline',
          location: '',
          latitude: 0,
          longitude: 0,
          isFavorite: false,
          context: '从系统通讯录同步',
          bestTime: '',
          lastContact: Date.now(),
          categories: [],
          tags: ['系统导入'],
        });
        syncedCount++;
      }
    }
    setSynced(syncedCount);
    setSkipped(skippedCount);
    Alert.alert('同步完成', '新增 ' + syncedCount + ' 位\n已更新 ' + skippedCount + ' 位');
  };

  if (permission === null) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>系统联系人同步</Text>
      </View>

      {loading ? (
        <View style={styles.centerWrap}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>读取系统联系人...</Text>
        </View>
      ) : !permission ? (
        <View style={styles.centerWrap}>
          <Icon name="lock" size={48} color="#ef4444" />
          <Text style={styles.permTitle}>需要通讯录权限</Text>
          <Text style={styles.permSubtitle}>请在系统设置中允许 GeoContacts+ 访问通讯录</Text>
          <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
            <Text style={styles.permBtnText}>授予权限</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{systemContacts.length}</Text>
              <Text style={styles.statLabel}>系统联系人</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{contacts.length}</Text>
              <Text style={styles.statLabel}>已导入</Text>
            </View>
            {synced > 0 && (
              <View style={styles.statBox}>
                <Text style={[styles.statNum, { color: '#10b981' }]}>{synced}</Text>
                <Text style={styles.statLabel}>本次新增</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.syncBtn} onPress={syncContacts} disabled={!systemContacts.length}>
            <Icon name="sync-alt" size={20} color="#fff" />
            <Text style={styles.syncBtnText}>开始同步</Text>
          </TouchableOpacity>

          {systemContacts.length > 0 && (
            <View style={styles.listWrap}>
              <Text style={styles.listTitle}>系统联系人预览</Text>
              {systemContacts.slice(0, 20).map(c => (
                <View key={c.id} style={styles.contactRow}>
                  <View style={styles.contactAvatar}>
                    <Text style={styles.avatarText}>{(c.name || '?')[0]}</Text>
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{c.name}</Text>
                    <Text style={styles.contactPhone}>{c.phoneNumbers?.[0]?.number || '无号码'}</Text>
                  </View>
                  {contacts.find(e => e.phone === (c.phoneNumbers?.[0]?.number || '').replace(/[^\d+]/g, '')) && (
                    <Icon name="check-circle" size={16} color="#10b981" />
                  )}
                </View>
              ))}
              {systemContacts.length > 20 && (
                <Text style={styles.moreText}>...还有 {systemContacts.length - 20} 位联系人</Text>
              )}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 56 },
  backBtn: { padding: 8, marginRight: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  centerWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  loadingText: { color: '#94a3b8', marginTop: 12 },
  permTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginTop: 16 },
  permSubtitle: { fontSize: 13, color: '#94a3b8', marginTop: 8, textAlign: 'center' },
  permBtn: { marginTop: 20, paddingHorizontal: 24, paddingVertical: 10, backgroundColor: '#3b82f6', borderRadius: 8 },
  permBtnText: { color: '#fff', fontWeight: '600' },
  statsRow: { flexDirection: 'row', margin: 16, gap: 8 },
  statBox: { flex: 1, padding: 16, backgroundColor: 'rgba(30,41,59,0.7)', borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  statNum: { fontSize: 24, fontWeight: 'bold', color: '#3b82f6' },
  statLabel: { fontSize: 12, color: '#64748b', marginTop: 4 },
  syncBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 16, padding: 16, backgroundColor: '#3b82f6', borderRadius: 12, gap: 8 },
  syncBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  listWrap: { margin: 16, marginTop: 0 },
  listTitle: { fontSize: 14, fontWeight: '600', color: '#94a3b8', marginBottom: 8 },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  contactAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontWeight: '600' },
  contactInfo: { flex: 1 },
  contactName: { color: '#e2e8f0', fontSize: 14 },
  contactPhone: { color: '#64748b', fontSize: 12 },
  moreText: { textAlign: 'center', color: '#64748b', paddingVertical: 12, fontSize: 13 },
});

export default ContactSyncScreen;
