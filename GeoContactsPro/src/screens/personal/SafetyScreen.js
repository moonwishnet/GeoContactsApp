import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../../context/AppContext';

const SafetyScreen = ({ navigation }) => {
  const { sosContacts, guardianObjects, safeZones, settings, saveSettings } = useApp();
  const [sosEnabled, setSosEnabled] = useState(true);

  const handleSOS = () => {
    navigation.navigate('SOSAlert');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* SOS快捷入口 */}
        <View style={styles.sosSection}>
          <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
            <Icon name="exclamation-triangle" size={40} color="#fff" />
            <Text style={styles.sosTitle}>SOS紧急求助</Text>
            <Text style={styles.sosSubtitle}>点击快速触发紧急求助</Text>
          </TouchableOpacity>
        </View>

        {/* 紧急联系人 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>紧急联系人</Text>
            <TouchableOpacity onPress={() => Alert.alert('提示', '紧急联系人设置功能开发中')}>
              <Text style={styles.sectionAction}>管理</Text>
            </TouchableOpacity>
          </View>
          {sosContacts.map((contact, index) => (
            <View key={index} style={styles.contactItem}>
              <View style={styles.contactAvatar}>
                <Text style={styles.contactAvatarText}>{contact.name[0]}</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
              </View>
              <Icon name="phone" size={16} color="#3b82f6" />
            </View>
          ))}
        </View>

        {/* 亲情守护 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>亲情守护</Text>
            <TouchableOpacity onPress={() => Alert.alert('提示', '亲情守护功能开发中')}>
              <Text style={styles.sectionAction}>添加</Text>
            </TouchableOpacity>
          </View>
          {guardianObjects.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>暂无守护对象</Text>
              <Text style={styles.emptySubtext}>添加家人或好友，实时关注他们的位置</Text>
            </View>
          ) : (
            guardianObjects.map((obj, index) => (
              <View key={index} style={styles.guardianItem}>
                <View style={styles.guardianAvatar}>
                  <Text style={styles.guardianAvatarText}>{obj.name[0]}</Text>
                </View>
                <View style={styles.guardianInfo}>
                  <Text style={styles.guardianName}>{obj.name}</Text>
                  <Text style={styles.guardianStatus}>{obj.authorized ? '已授权' : '等待授权'}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* 安全区域 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>安全区域</Text>
            <TouchableOpacity onPress={() => Alert.alert('提示', '安全区域功能开发中')}>
              <Text style={styles.sectionAction}>添加</Text>
            </TouchableOpacity>
          </View>
          {safeZones.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>暂无安全区域</Text>
              <Text style={styles.emptySubtext}>设置安全区域，超出范围时接收提醒</Text>
            </View>
          ) : (
            safeZones.map((zone, index) => (
              <View key={index} style={styles.zoneItem}>
                <Icon name="map-marker-alt" size={20} color="#3b82f6" />
                <View style={styles.zoneInfo}>
                  <Text style={styles.zoneName}>{zone.name}</Text>
                  <Text style={styles.zoneRadius}>半径 {zone.radius}米</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* 安全设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>安全设置</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="bell" size={18} color="#3b82f6" />
              <Text style={styles.settingText}>SOS快捷触发</Text>
            </View>
            <Switch value={sosEnabled} onValueChange={setSosEnabled} trackColor={{ false: '#334155', true: '#3b82f6' }} thumbColor="#fff" />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="location-arrow" size={18} color="#10b981" />
              <Text style={styles.settingText}>实时位置共享</Text>
            </View>
            <Switch value={settings.location} onValueChange={(v) => saveSettings({ ...settings, location: v })} trackColor={{ false: '#334155', true: '#10b981' }} thumbColor="#fff" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  sosSection: { padding: 16 },
  sosButton: {
    backgroundColor: '#ef4444', borderRadius: 20, padding: 30, alignItems: 'center',
    shadowColor: '#ef4444', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10,
  },
  sosTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 12 },
  sosSubtitle: { fontSize: 13, color: 'rgba(255, 255, 255, 0.8)', marginTop: 4 },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  sectionAction: { fontSize: 14, color: '#3b82f6' },
  contactItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  contactAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  contactAvatarText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 15, fontWeight: '600', color: '#fff' },
  contactPhone: { fontSize: 13, color: '#64748b', marginTop: 2 },
  emptyCard: { backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 12, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  emptyText: { fontSize: 15, color: '#94a3b8' },
  emptySubtext: { fontSize: 13, color: '#64748b', marginTop: 4 },
  guardianItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  guardianAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#10b981', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  guardianAvatarText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  guardianInfo: { flex: 1 },
  guardianName: { fontSize: 15, fontWeight: '600', color: '#fff' },
  guardianStatus: { fontSize: 13, color: '#10b981', marginTop: 2 },
  zoneItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  zoneInfo: { flex: 1, marginLeft: 12 },
  zoneName: { fontSize: 15, fontWeight: '600', color: '#fff' },
  zoneRadius: { fontSize: 13, color: '#64748b', marginTop: 2 },
  settingItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 12, padding: 16,
    marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingText: { fontSize: 15, color: '#fff' },
});

export default SafetyScreen;
