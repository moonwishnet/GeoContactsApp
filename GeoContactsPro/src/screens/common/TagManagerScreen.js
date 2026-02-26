import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../../context/AppContext';

const TagManagerScreen = () => {
  const { spatiotemporalTags, addSpatiotemporalTag, updateSpatiotemporalTag, deleteSpatiotemporalTag } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [tagName, setTagName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('tag');

  const icons = ['tag', 'home', 'briefcase', 'map-marker-alt', 'user', 'users', 'star', 'heart', 'bookmark'];
  const colors = ['blue', 'green', 'purple', 'orange', 'pink', 'red', 'yellow'];

  const openAddModal = () => {
    setEditingTag(null);
    setTagName('');
    setSelectedIcon('tag');
    setModalVisible(true);
  };

  const openEditModal = (tag) => {
    setEditingTag(tag);
    setTagName(tag.name);
    setSelectedIcon(tag.icon);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!tagName.trim()) {
      Alert.alert('错误', '请输入标签名称');
      return;
    }

    if (editingTag) {
      updateSpatiotemporalTag(editingTag.id, { name: tagName.trim(), icon: selectedIcon });
    } else {
      addSpatiotemporalTag({ name: tagName.trim(), icon: selectedIcon, color: 'blue' });
    }

    setModalVisible(false);
  };

  const handleDelete = (tag) => {
    Alert.alert('删除标签', `确定要删除 "${tag.name}" 吗？`, [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: () => deleteSpatiotemporalTag(tag.id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>时空标签管理</Text>
          <Text style={styles.headerSubtitle}>自定义标签，方便分类管理联系人</Text>
        </View>

        <View style={styles.tagList}>
          {spatiotemporalTags.map((tag) => (
            <View key={tag.id} style={styles.tagItem}>
              <View style={styles.tagLeft}>
                <View style={[styles.tagIcon, { backgroundColor: '#3b82f620' }]}>
                  <Icon name={tag.icon} size={18} color="#3b82f6" />
                </View>
                <Text style={styles.tagName}>{tag.name}</Text>
              </View>
              <View style={styles.tagActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => openEditModal(tag)}>
                  <Icon name="edit" size={16} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(tag)}>
                  <Icon name="trash-alt" size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Icon name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>添加标签</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 添加/编辑标签弹窗 */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingTag ? '编辑标签' : '添加标签'}</Text>

            <TextInput
              style={styles.input}
              placeholder="标签名称"
              placeholderTextColor="#64748b"
              value={tagName}
              onChangeText={setTagName}
              maxLength={20}
            />

            <Text style={styles.iconLabel}>选择图标</Text>
            <View style={styles.iconGrid}>
              {icons.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[styles.iconOption, selectedIcon === icon && styles.iconOptionSelected]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Icon name={icon} size={20} color={selectedIcon === icon ? '#3b82f6' : '#94a3b8'} />
                </TouchableOpacity>
              ))}
            </View>

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
  tagList: { gap: 8 },
  tagItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tagLeft: { flexDirection: 'row', alignItems: 'center' },
  tagIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  tagName: { fontSize: 15, color: '#fff' },
  tagActions: { flexDirection: 'row', gap: 8 },
  actionButton: { width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(255, 255, 255, 0.05)', justifyContent: 'center', alignItems: 'center' },
  addButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#3b82f6', borderRadius: 12, paddingVertical: 14, marginTop: 20,
  },
  addButtonText: { fontSize: 15, fontWeight: '600', color: '#fff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1e293b', borderRadius: 20, padding: 24, width: '100%', maxWidth: 320, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: 'rgba(15, 23, 42, 0.5)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: '#fff', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', marginBottom: 16 },
  iconLabel: { fontSize: 14, color: '#94a3b8', marginBottom: 12 },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  iconOption: { width: 44, height: 44, borderRadius: 10, backgroundColor: 'rgba(15, 23, 42, 0.5)', justifyContent: 'center', alignItems: 'center' },
  iconOptionSelected: { backgroundColor: 'rgba(59, 130, 246, 0.2)', borderWidth: 2, borderColor: '#3b82f6' },
  modalButtons: { flexDirection: 'row', gap: 12 },
  cancelButton: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.1)', alignItems: 'center' },
  cancelText: { fontSize: 14, color: '#94a3b8', fontWeight: '600' },
  saveButton: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#3b82f6', alignItems: 'center' },
  saveText: { fontSize: 14, color: '#fff', fontWeight: '600' },
});

export default TagManagerScreen;
