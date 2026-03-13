import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../context/AppContext';

const SOSSettingsScreen = ({ navigation }) => {
  const { sosContacts, saveSosContacts, contacts } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showContactPicker, setShowContactPicker] = useState(false);

  // 打开添加弹窗
  const openAddModal = () => {
    setEditingIndex(null);
    setName('');
    setPhone('');
    setModalVisible(true);
  };

  // 打开编辑弹窗
  const openEditModal = (index) => {
    setEditingIndex(index);
    setName(sosContacts[index].name);
    setPhone(sosContacts[index].phone);
    setModalVisible(true);
  };

  // 保存紧急联系人
  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('错误', '请输入联系人姓名');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('错误', '请输入联系电话');
      return;
    }

    const newContact = { name: name.trim(), phone: phone.trim() };
    let updated;
    
    if (editingIndex !== null) {
      updated = [...sosContacts];
      updated[editingIndex] = newContact;
    } else {
      updated = [...sosContacts, newContact];
    }
    
    saveSosContacts(updated);
    setModalVisible(false);
  };

  // 删除紧急联系人
  const handleDelete = (index) => {
    Alert.alert(
      '删除联系人',
      `确定要删除 "${sosContacts[index].name}" 吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            const updated = sosContacts.filter((_, i) => i !== index);
            saveSosContacts(updated);
          },
        },
      ]
    );
  };

  // 从现有联系人选择
  const selectFromContacts = (contact) => {
    setName(contact.name);
    setPhone(contact.phone);
    setShowContactPicker(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>SOS紧急联系人</Text>
      </View>

      {/* 说明卡片 */}
      <View style={styles.infoCard}>
        <Icon name="exclamation-triangle" size={24} color="#ef4444" />
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoTitle}>紧急求助功能</Text>
          <Text style={styles.infoSubtitle}>
            触发SOS时，将发送位置信息给以下联系人，并拨打第一个联系人的电话
          </Text>
        </View>
      </View>

      {/* 联系人列表 */}
      <ScrollView style={styles.contactList} showsVerticalScrollIndicator={false}>
        {sosContacts.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="user-shield" size={48} color="#334155" />
            <Text style={styles.emptyText}>暂无紧急联系人</Text>
            <Text style={styles.emptyHint}>请添加至少一位紧急联系人</Text>
          </View>
        ) : (
          sosContacts.map((contact, index) => (
            <View key={index} style={styles.contactCard}>
              <View style={styles.contactLeft}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{contact.name[0]}</Text>
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                </View>
              </View>
              <View style={styles.contactActions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => openEditModal(index)}
                >
                  <Icon name="edit" size={16} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleDelete(index)}
                >
                  <Icon name="trash-alt" size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* 添加按钮 */}
      <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
        <Icon name="plus" size={20} color="#fff" />
        <Text style={styles.addButtonText}>添加紧急联系人</Text>
      </TouchableOpacity>

      {/* 添加/编辑弹窗 */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingIndex !== null ? '编辑联系人' : '添加联系人'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="姓名"
              placeholderTextColor="#64748b"
              value={name}
              onChangeText={setName}
              maxLength={20}
            />

            <TextInput
              style={styles.input}
              placeholder="电话"
              placeholderTextColor="#64748b"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={20}
            />

            <TouchableOpacity
              style={styles.selectFromContacts}
              onPress={() => setShowContactPicker(true)}
            >
              <Icon name="address-book" size={16} color="#3b82f6" />
              <Text style={styles.selectFromContactsText}>从联系人中选择</Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>保存</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 联系人选择弹窗 */}
      <Modal
        visible={showContactPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowContactPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.pickerModal]}>
            <View style={styles.pickerHeader}>
              <Text style={styles.modalTitle}>选择联系人</Text>
              <TouchableOpacity onPress={() => setShowContactPicker(false)}>
                <Icon name="times" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.pickerList}>
              {contacts.map((contact) => (
                <TouchableOpacity
                  key={contact.id}
                  style={styles.pickerItem}
                  onPress={() => selectFromContacts(contact)}
                >
                  <View style={styles.pickerAvatar}>
                    <Text style={styles.pickerAvatarText}>{contact.name[0]}</Text>
                  </View>
                  <View style={styles.pickerInfo}>
                    <Text style={styles.pickerName}>{contact.name}</Text>
                    <Text style={styles.pickerPhone}>{contact.phone}</Text>
                  </View>
                  <Icon name="chevron-right" size={16} color="#64748b" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 56,
  },
  backBtn: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
  },
  contactList: {
    flex: 1,
    marginHorizontal: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 16,
  },
  emptyHint: {
    fontSize: 13,
    color: '#475569',
    marginTop: 8,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: '#94a3b8',
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 16,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  pickerModal: {
    maxHeight: '80%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
  },
  selectFromContacts: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  selectFromContactsText: {
    fontSize: 14,
    color: '#3b82f6',
    marginLeft: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    alignItems: 'center',
  },
  saveText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  pickerList: {
    maxHeight: 400,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  pickerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  pickerAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  pickerInfo: {
    flex: 1,
  },
  pickerName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 2,
  },
  pickerPhone: {
    fontSize: 13,
    color: '#64748b',
  },
});

export default SOSSettingsScreen;
