import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useLocationShare } from '../context/LocationShareContext';
import { useApp } from '../context/AppContext';

const LocationShareScreen = ({ navigation }) => {
  const { isSharing, friends, startSharing, stopSharing, getCurrentLocation, addFriend, removeFriend } = useLocationShare();
  const { contacts } = useApp();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);

  const handleToggle = async () => {
    setLoading(true);
    if (isSharing) {
      await stopSharing();
      Alert.alert('已停止', '位置共享已关闭');
    } else {
      const ok = await startSharing();
      if (ok) {
        const loc = await getCurrentLocation();
        setLocation(loc);
        Alert.alert('已开启', '位置共享已开启，好友可以查看你的位置');
      } else {
        Alert.alert('权限不足', '需要位置权限才能开启共享');
      }
    }
    setLoading(false);
  };

  const handleAddFriend = () => {
    const available = contacts.filter(c => !friends.find(f => f.id === c.id));
    if (!available.length) { Alert.alert('提示', '没有更多联系人可添加'); return; }
    Alert.alert('添加好友', '选择联系人开启位置共享：\n\n' + available.map((c, i) => (i + 1) + '. ' + c.name).join('\n'), [
      { text: '取消', style: 'cancel' },
      {
        text: '全部添加',
        onPress: () => available.forEach(c => addFriend({ id: c.id, name: c.name, allowed: true })),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>实时位置共享</Text>
      </View>

      {/* 状态卡片 */}
      <View style={[styles.statusCard, isSharing ? styles.statusOn : styles.statusOff]}>
        <Icon name={isSharing ? 'broadcast-tower' : 'map-marker-alt'} size={40} color={isSharing ? '#10b981' : '#64748b'} />
        <Text style={styles.statusTitle}>{isSharing ? '位置共享中' : '位置共享已关闭'}</Text>
        <Text style={styles.statusSubtitle}>{isSharing ? '好友可以实时查看你的位置' : '开启后好友可以查看你的位置'}</Text>
        <TouchableOpacity style={[styles.toggleBtn, isSharing ? styles.toggleOff : styles.toggleOn]} onPress={handleToggle} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.toggleText}>{isSharing ? '停止共享' : '开启共享'}</Text>}
        </TouchableOpacity>
      </View>

      {location && (
        <View style={styles.locCard}>
          <Text style={styles.locText}>📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</Text>
        </View>
      )}

      {/* 共享好友列表 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>共享对象 ({friends.length})</Text>
          <TouchableOpacity onPress={handleAddFriend} style={styles.addBtn}>
            <Icon name="plus" size={14} color="#3b82f6" />
            <Text style={styles.addBtnText}>添加</Text>
          </TouchableOpacity>
        </View>
        {friends.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="user-friends" size={40} color="#334155" />
            <Text style={styles.emptyText}>暂无共享对象</Text>
            <Text style={styles.emptyHint}>点击上方"添加"邀请联系人</Text>
          </View>
        ) : (
          friends.map(friend => (
            <View key={friend.id} style={styles.friendRow}>
              <View style={styles.friendAvatar}>
                <Text style={styles.friendAvatarText}>{friend.name[0]}</Text>
              </View>
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{friend.name}</Text>
                <Text style={styles.friendStatus}>可查看你的位置</Text>
              </View>
              <TouchableOpacity onPress={() => removeFriend(friend.id)}>
                <Icon name="times-circle" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* 隐私提示 */}
      <View style={styles.privacyCard}>
        <Text style={styles.privacyTitle}>🔒 隐私说明</Text>
        <Text style={styles.privacyText}>• 位置信息仅在共享开启时传输</Text>
        <Text style={styles.privacyText}>• 每5分钟更新一次位置</Text>
        <Text style={styles.privacyText}>• 你可以随时关闭共享</Text>
        <Text style={styles.privacyText}>• 位置数据不存储在服务器上</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 56 },
  backBtn: { padding: 8, marginRight: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  statusCard: { margin: 16, padding: 24, borderRadius: 20, alignItems: 'center' },
  statusOn: { backgroundColor: 'rgba(16,185,129,0.1)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.3)' },
  statusOff: { backgroundColor: 'rgba(100,116,139,0.1)', borderWidth: 1, borderColor: 'rgba(100,116,139,0.3)' },
  statusTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginTop: 12 },
  statusSubtitle: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
  toggleBtn: { marginTop: 16, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  toggleOn: { backgroundColor: '#3b82f6' },
  toggleOff: { backgroundColor: 'rgba(239,68,68,0.3)' },
  toggleText: { color: '#fff', fontWeight: '600' },
  locCard: { marginHorizontal: 16, padding: 12, backgroundColor: 'rgba(30,41,59,0.7)', borderRadius: 12, alignItems: 'center' },
  locText: { color: '#94a3b8', fontSize: 13 },
  section: { margin: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addBtnText: { fontSize: 13, color: '#3b82f6' },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#64748b', fontSize: 14, marginTop: 12 },
  emptyHint: { color: '#475569', fontSize: 12, marginTop: 4 },
  friendRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  friendAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  friendAvatarText: { color: '#fff', fontWeight: '600' },
  friendInfo: { flex: 1 },
  friendName: { color: '#e2e8f0', fontSize: 14 },
  friendStatus: { color: '#64748b', fontSize: 12 },
  privacyCard: { margin: 16, padding: 16, backgroundColor: 'rgba(30,41,59,0.5)', borderRadius: 12 },
  privacyTitle: { fontSize: 14, fontWeight: '600', color: '#fbbf24', marginBottom: 8 },
  privacyText: { fontSize: 13, color: '#94a3b8', marginBottom: 4 },
});

export default LocationShareScreen;
