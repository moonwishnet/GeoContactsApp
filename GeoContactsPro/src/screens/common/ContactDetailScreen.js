import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../../context/AppContext';
import { makePhoneCall, navigateToLocation, sendSMSMessage } from '../../utils/communication';
import { formatLastContact, formatDistance } from '../../utils/time';

const ContactDetailScreen = ({ route, navigation }) => {
  const { contact } = route.params;
  const { defaultNavigation, updateContactLastContact, updateContact, deleteContact } = useApp();

  const statusColor = { online: '#10b981', busy: '#f59e0b', offline: '#6b7280' }[contact.status] || '#6b7280';

  const handleCall = async () => {
    const result = await makePhoneCall(contact.phone);
    if (result.success) updateContactLastContact(contact.id);
  };

  const handleSMS = async () => {
    await sendSMSMessage(contact.phone);
  };

  const handleNavigate = async () => {
    if (contact.latitude && contact.longitude) {
      await navigateToLocation(contact.latitude, contact.longitude, contact.name, defaultNavigation);
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditContact', { contact });
  };

  const handleDelete = () => {
    Alert.alert('删除联系人', `确定要删除 ${contact.name} 吗？`, [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: async () => { await deleteContact(contact.id); navigation.goBack(); } },
    ]);
  };

  const stars = '★'.repeat(contact.relationship) + '☆'.repeat(5 - contact.relationship);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 头部信息 */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{contact.name[0]}</Text></View>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          {contact.isFavorite && <View style={styles.favoriteBadge}><Icon name="star" size={12} color="#fbbf24" /></View>}
        </View>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.phone}>{contact.phone}</Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{contact.status === 'online' ? '在线' : contact.status === 'busy' ? '忙碌' : '离线'}</Text>
          </View>
          <Text style={styles.stars}>{stars}</Text>
        </View>

        {/* 快捷操作 */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={handleCall}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#3b82f6' }]}><Icon name="phone" size={20} color="#fff" /></View>
            <Text style={styles.quickActionText}>打电话</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={handleSMS}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#10b981' }]}><Icon name="comment" size={20} color="#fff" /></View>
            <Text style={styles.quickActionText}>发短信</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={handleNavigate}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#8b5cf6' }]}><Icon name="location-arrow" size={20} color="#fff" /></View>
            <Text style={styles.quickActionText}>导航</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 详细信息 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>详细信息</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoItem}><Icon name="map-marker-alt" size={16} color="#3b82f6" /><Text style={styles.infoLabel}>当前位置</Text><Text style={styles.infoValue}>{contact.location}</Text></View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}><Icon name="road" size={16} color="#10b981" /><Text style={styles.infoLabel}>距离</Text><Text style={styles.infoValue}>{formatDistance(contact.distance, contact.distanceUnit)}</Text></View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}><Icon name="clock" size={16} color="#f59e0b" /><Text style={styles.infoLabel}>最近联系</Text><Text style={styles.infoValue}>{formatLastContact(contact.lastContact)}</Text></View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}><Icon name="comment-dots" size={16} color="#8b5cf6" /><Text style={styles.infoLabel}>状态</Text><Text style={styles.infoValue}>{contact.context}</Text></View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}><Icon name="calendar-check" size={16} color="#ec4899" /><Text style={styles.infoLabel}>最佳联系时间</Text><Text style={styles.infoValue}>{contact.bestTime}</Text></View>
        </View>
      </View>

      {/* 标签 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>标签</Text>
        <View style={styles.tagsCard}>
          {contact.tags.map((tag, index) => (
            <View key={index} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>
          ))}
        </View>
      </View>

      {/* 操作按钮 */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}><Icon name="edit" size={16} color="#fff" /><Text style={styles.editButtonText}>编辑联系人</Text></TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}><Icon name="trash-alt" size={16} color="#ef4444" /><Text style={styles.deleteButtonText}>删除联系人</Text></TouchableOpacity>
      </View>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { alignItems: 'center', paddingVertical: 30, paddingHorizontal: 20 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 40, fontWeight: 'bold', color: '#fff' },
  statusDot: { position: 'absolute', bottom: 4, right: 4, width: 20, height: 20, borderRadius: 10, borderWidth: 3, borderColor: '#0f172a' },
  favoriteBadge: { position: 'absolute', top: -4, right: -4, width: 28, height: 28, borderRadius: 14, backgroundColor: '#f59e0b', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#0f172a' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  phone: { fontSize: 16, color: '#64748b', marginBottom: 12 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, gap: 6 },
  statusIndicator: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontWeight: '500' },
  stars: { fontSize: 16, color: '#fbbf24', letterSpacing: -1 },
  quickActions: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 24 },
  quickAction: { alignItems: 'center' },
  quickActionIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  quickActionText: { fontSize: 12, color: '#94a3b8' },
  section: { marginHorizontal: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 12 },
  infoCard: { backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  infoItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  infoLabel: { fontSize: 14, color: '#94a3b8' },
  infoValue: { fontSize: 14, color: '#fff', fontWeight: '500', maxWidth: 150, textAlign: 'right' },
  infoDivider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)', marginHorizontal: 16 },
  tagsCard: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  tag: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'rgba(100, 116, 139, 0.3)', borderRadius: 20 },
  tagText: { fontSize: 12, color: '#94a3b8' },
  editButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#3b82f6', borderRadius: 12, paddingVertical: 14 },
  editButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  deleteButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 12, paddingVertical: 14, marginTop: 12, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' },
  deleteButtonText: { fontSize: 14, fontWeight: '600', color: '#ef4444' },
  bottomSpace: { height: 40 },
});

export default ContactDetailScreen;
