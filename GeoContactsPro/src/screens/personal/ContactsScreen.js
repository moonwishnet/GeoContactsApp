import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../../context/AppContext';
import ContactCard from '../../components/ContactCard';
import { importFromPhoneContacts, exportContactsToFile, exportContactsToCSV } from '../../utils/contactImportExport';

const ContactsScreen = ({ navigation }) => {
  const { contacts, spatiotemporalTags, groups, addContact } = useApp();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const getFilteredContacts = useCallback(() => {
    let filtered = [...contacts];

    if (activeFilter === 'favorites') {
      filtered = filtered.filter(c => c.isFavorite);
    } else if (activeFilter === 'recent') {
      filtered = filtered.filter(c => c.lastContact && (Date.now() - c.lastContact < 7 * 24 * 60 * 60 * 1000));
    }

    if (selectedTag) {
      filtered = filtered.filter(c => c.tags.includes(selectedTag.name));
    }

    if (selectedGroup) {
      filtered = filtered.filter(c => selectedGroup.contactIds.includes(c.id));
    }

    filtered.sort((a, b) => (b.lastContact || 0) - (a.lastContact || 0));
    return filtered;
  }, [contacts, activeFilter, selectedTag, selectedGroup]);

  const handleImport = async () => {
    const result = await importFromPhoneContacts();
    if (result.success) {
      result.contacts.forEach(contact => addContact(contact));
      Alert.alert('导入成功', `成功导入 ${result.totalImported} 个联系人`);
    } else {
      Alert.alert('导入失败', result.error);
    }
  };

  const handleExport = async () => {
    Alert.alert(
      '导出联系人',
      '选择导出格式',
      [
        { text: '加密备份', onPress: () => exportContactsToFile(contacts, true) },
        { text: 'JSON格式', onPress: () => exportContactsToFile(contacts, false) },
        { text: 'CSV格式', onPress: () => exportContactsToCSV(contacts) },
        { text: '取消', style: 'cancel' },
      ]
    );
  };

  const filteredContacts = getFilteredContacts();

  return (
    <View style={styles.container}>
      {/* 筛选栏 */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterChip, activeFilter === 'all' && styles.filterChipActive]}
            onPress={() => { setActiveFilter('all'); setSelectedTag(null); setSelectedGroup(null); }}
          >
            <Text style={[styles.filterChipText, activeFilter === 'all' && styles.filterChipTextActive]}>全部</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, activeFilter === 'favorites' && styles.filterChipActive]}
            onPress={() => { setActiveFilter('favorites'); setSelectedTag(null); setSelectedGroup(null); }}
          >
            <Icon name="star" size={12} color={activeFilter === 'favorites' ? '#fff' : '#94a3b8'} />
            <Text style={[styles.filterChipText, activeFilter === 'favorites' && styles.filterChipTextActive]}>收藏</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, activeFilter === 'recent' && styles.filterChipActive]}
            onPress={() => { setActiveFilter('recent'); setSelectedTag(null); setSelectedGroup(null); }}
          >
            <Icon name="clock" size={12} color={activeFilter === 'recent' ? '#fff' : '#94a3b8'} />
            <Text style={[styles.filterChipText, activeFilter === 'recent' && styles.filterChipTextActive]}>最近</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* 标签筛选 */}
      <View style={styles.tagSection}>
        <Text style={styles.sectionTitle}>时空标签</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {spatiotemporalTags.map(tag => (
            <TouchableOpacity
              key={tag.id}
              style={[styles.tagChip, selectedTag?.id === tag.id && styles.tagChipActive]}
              onPress={() => setSelectedTag(selectedTag?.id === tag.id ? null : tag)}
            >
              <Icon name={tag.icon} size={12} color={selectedTag?.id === tag.id ? '#fff' : '#94a3b8'} />
              <Text style={[styles.tagChipText, selectedTag?.id === tag.id && styles.tagChipTextActive]}>{tag.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 操作按钮 */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionButton} onPress={handleImport}>
          <Icon name="download" size={14} color="#3b82f6" />
          <Text style={styles.actionButtonText}>导入</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleExport}>
          <Icon name="upload" size={14} color="#10b981" />
          <Text style={styles.actionButtonText}>导出</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('TagManager')}>
          <Icon name="tags" size={14} color="#8b5cf6" />
          <Text style={styles.actionButtonText}>标签</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('GroupManager')}>
          <Icon name="object-group" size={14} color="#f59e0b" />
          <Text style={styles.actionButtonText}>分组</Text>
        </TouchableOpacity>
      </View>

      {/* 联系人列表 */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>联系人</Text>
          <Text style={styles.listCount}>{filteredContacts.length}人</Text>
        </View>
        <FlatList
          data={filteredContacts}
          renderItem={({ item }) => (
            <ContactCard
              contact={item}
              onPress={() => navigation.navigate('ContactDetail', { contact: item })}
            />
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      </View>

      {/* 添加按钮 */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddContact')}>
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  filterBar: { paddingHorizontal: 16, paddingVertical: 12 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 20, marginRight: 8, gap: 6,
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterChipActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  filterChipText: { fontSize: 13, color: '#94a3b8' },
  filterChipTextActive: { color: '#fff', fontWeight: '600' },
  tagSection: { paddingHorizontal: 16, paddingBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 8 },
  tagChip: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 16, marginRight: 8, gap: 6,
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tagChipActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  tagChipText: { fontSize: 12, color: '#94a3b8' },
  tagChipTextActive: { color: '#fff' },
  actionBar: {
    flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionButtonText: { fontSize: 13, color: '#94a3b8' },
  listContainer: { flex: 1, paddingHorizontal: 16 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  listTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  listCount: { fontSize: 13, color: '#64748b' },
  list: { paddingBottom: 80 },
  fab: {
    position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
});

export default ContactsScreen;
