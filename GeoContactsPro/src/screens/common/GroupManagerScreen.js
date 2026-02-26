import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../../context/AppContext';

const GroupManagerScreen = () => {
  const { contacts, groups, addGroup, updateGroup, deleteGroup } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);

  const openAddModal = () => {
    setEditingGroup(null);
    setGroupName('');
    setSelectedContacts([]);
    setModalVisible(true);
  };

  const openEditModal = (group) => {
    setEditingGroup(group);
    setGroupName(group.name);
    setSelectedContacts(group.contactIds || []);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!groupName.trim()) {
      Alert.alert('错误', '请输入分组名称');
      return;
    }

    if (editingGroup) {
      updateGroup(editingGroup.id, { name: groupName.trim(), contactIds: selectedContacts });
    } else {
      addGroup({ name: groupName.trim(), contactIds: selectedContacts });
    }

    setModalVisible(false);
  };

  const handleDelete = (group) => {
    Alert.alert('删除分组', `确定要删除 "${group.name}" 吗？`, [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: () => deleteGroup(group.id) },
    ]);
  };

  const toggleContact = (contactId) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>分组管理</Text>
          <Text style={styles.headerSubtitle}>创建分组，批量管理联系人</Text>
        </View>

        <View style={styles.groupList}>
          {groups.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>暂无分组</Text>
              <Text style={styles.emptySubtext}>点击下方按钮创建分组</Text>
            </View>
          ) : (
            groups.map((group) => (
              <View key={group.id} style={styles.groupItem}>
                <View style={styles.groupLeft}>
                  <View style={styles.groupIcon}>
                    <Icon name="users" size={18} color="#3b82f6" />
                  </View>
                  <View style={styles.groupInfo}>
                    <Text style={styles.groupName}>{group.name}</Text>
                    <Text style={styles.groupCount}>{(group.contactIds || []).length} 人</Text>
                  </View>
                </View>
                <View style={styles.groupActions}>
                  <TouchableOpacity style={styles.actionButton} onPress={() => openEditModal(group)}>
                    <Icon name="edit" size={16} color="#3b82f6" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(group)}>
                    <Icon name="trash-alt" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Icon name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>创建分组</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 添加/编辑分组弹窗 */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingGroup ? '编辑分组' : '创建分组'}</Text>

            <TextInput
              style={styles.input}
              placeholder="分组名称"
              placeholderTextColor="#64748b"
              value={groupName}
              onChangeText={setGroupName}
              maxLength={20}
            />

            <Text style={styles.contactsLabel}>选择联系人 ({selectedContacts.length}人)</Text>
            <ScrollView style={styles.contactsList} showsVerticalScrollIndicator={false}>
              {contacts.map((contact) => (
                <TouchableOpacity
                  key={contact.id}
                  style={[styles.contactItem, selectedContacts.includes(contact.id) && styles.contactItemSelected]}
                  onPress={() => toggleContact(contact.id)}
                >
                  <View style={styles.contactAvatar}>
                    <Text style={styles.contactAvatarText}>{contact.name[0]}</Text>
                  </View>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  {selectedContacts.includes(contact.id) && (
                    <Icon name="check-circle" size={20} color="#3b82f6" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>保存</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: '#64748b' },
  groupList: { gap: 8 },
  emptyCard: { backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 12, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  emptyText: { fontSize: 15, color: '#94a3b8' },
  emptySubtext: { fontSize: 13, color: '#64748b', marginTop: 4 },
  groupItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  groupLeft: { flexDirection: 'row', alignItems: 'center' },
  groupIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(59, 130, 246, 0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  groupInfo: { flex: 1 },
  groupName: { fontSize: 15, color: '#fff' },
  groupCount: { fontSize: 13, color: '#64748b', marginTop: 2 },
  groupActions: { flexDirection: 'row', gap: 8 },
  actionButton: { width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(255, 255, 255, 0.05)', justifyContent: 'center', alignItems: 'center' },
  addButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#3b82f6', borderRadius: 12, paddingVertical: 14, marginTop: 20,
  },
  addButtonText: { fontSize: 15, fontWeight: '600', color: '#fff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1e293b', borderRadius: 20, padding: 24, width: '100%', maxWidth: 360, maxHeight: '80%', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: 'rgba(15, 23, 42, 0.5)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: '#fff', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', marginBottom: 16 },
  contactsLabel: { fontSize: 14, color: '#94a3b8', marginBottom: 12 },
  contactsList: { maxHeight: 200, marginBottom: 16 },
  contactItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8, marginBottom: 4 },
  contactItemSelected: { backgroundColor: 'rgba(59, 130, 246, 0.2)' },
  contactAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  contactAvatarText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
  contactName: { flex: 1, fontSize: 14, color: '#fff' },
  modalButtons: { flexDirection: 'row', gap: 12 },
  cancelButton: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.1)', alignItems: 'center' },
  cancelText: { fontSize: 14, color: '#94a3b8', fontWeight: '600' },
  saveButton: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#3b82f6', alignItems: 'center' },
  saveText: { fontSize: 14, color: '#fff', fontWeight: '600' },
});

export default GroupManagerScreen;
