import React, { useState, useEffect } from 'react';
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

const EditContactScreen = ({ route, navigation }) => {
  const { contact } = route.params;
  const { updateContact, categoryDimensions, deleteContact } = useApp();
  
  const [name, setName] = useState(contact.name);
  const [phone, setPhone] = useState(contact.phone);
  const [location, setLocation] = useState(contact.location);
  const [context, setContext] = useState(contact.context);
  const [selectedCategories, setSelectedCategories] = useState(contact.categories || []);
  const [relationship, setRelationship] = useState(contact.relationship || 3);
  const [isFavorite, setIsFavorite] = useState(contact.isFavorite || false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 获取所有可选分类
  const getAllCategories = () => {
    const categories = [];
    ['work', 'personal'].forEach(dim => {
      const tree = categoryDimensions[dim]?.tree || [];
      const collect = (nodes, dimKey, parentPath = []) => {
        nodes.forEach(node => {
          const path = [...parentPath, node.name];
          categories.push({ ...node, dimension: dimKey, path });
          if (node.children) {
            collect(node.children, dimKey, path);
          }
        });
      };
      collect(tree, dim);
    });
    return categories;
  };

  // 切换分类选择
  const toggleCategory = (category) => {
    const exists = selectedCategories.find(c => c.nodeId === category.id);
    if (exists) {
      setSelectedCategories(selectedCategories.filter(c => c.nodeId !== category.id));
    } else {
      setSelectedCategories([...selectedCategories, {
        dim: category.dimension,
        nodeId: category.id,
        path: category.path,
      }]);
    }
  };

  // 保存联系人
  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('错误', '请输入联系人姓名');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('错误', '请输入联系电话');
      return;
    }

    const updates = {
      name: name.trim(),
      phone: phone.trim(),
      location: location.trim() || '未知位置',
      context: context.trim() || '暂无状态',
      relationship,
      isFavorite,
      categories: selectedCategories,
    };

    updateContact(contact.id, updates);
    Alert.alert('成功', '联系人已更新', [
      { text: '确定', onPress: () => navigation.goBack() },
    ]);
  };

  // 删除联系人
  const handleDelete = () => {
    setShowDeleteConfirm(false);
    deleteContact(contact.id);
    Alert.alert('已删除', '联系人已删除', [
      { text: '确定', onPress: () => navigation.navigate('Main') },
    ]);
  };

  const allCategories = getAllCategories();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 基本信息 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>基本信息</Text>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>姓名 *</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入姓名"
              placeholderTextColor="#64748b"
              value={name}
              onChangeText={setName}
              maxLength={20}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>电话 *</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入电话号码"
              placeholderTextColor="#64748b"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={20}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>位置</Text>
            <TextInput
              style={styles.input}
              placeholder="例如：公司、家中"
              placeholderTextColor="#64748b"
              value={location}
              onChangeText={setLocation}
              maxLength={30}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>状态</Text>
            <TextInput
              style={styles.input}
              placeholder="例如：工作中、休息中"
              placeholderTextColor="#64748b"
              value={context}
              onChangeText={setContext}
              maxLength={30}
            />
          </View>
        </View>
      </View>

      {/* 关系等级 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>关系等级</Text>
        <View style={styles.card}>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRelationship(star)}
              >
                <Icon
                  name="star"
                  size={28}
                  color={star <= relationship ? '#fbbf24' : '#334155'}
                  style={styles.star}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingText}>
            {relationship === 1 && '普通认识'}
            {relationship === 2 && '一般朋友'}
            {relationship === 3 && '好朋友'}
            {relationship === 4 && '亲密朋友'}
            {relationship === 5 && '至亲好友'}
          </Text>
        </View>
      </View>

      {/* 收藏 */}
      <View style={styles.section}>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.favoriteRow}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <View style={styles.favoriteLeft}>
              <Icon name="star" size={18} color="#fbbf24" />
              <Text style={styles.favoriteText}>标记为收藏</Text>
            </View>
            <View style={[styles.checkbox, isFavorite && styles.checkboxActive]}>
              {isFavorite && <Icon name="check" size={12} color="#fff" />}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* 分类选择 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>分类</Text>
        <View style={styles.card}>
          {allCategories.length === 0 ? (
            <Text style={styles.emptyText}>暂无可用分类</Text>
          ) : (
            <View style={styles.categoriesGrid}>
              {allCategories.map((cat) => {
                const isSelected = selectedCategories.find(c => c.nodeId === cat.id);
                const color = cat.color === 'blue' ? '#3b82f6' :
                  cat.color === 'purple' ? '#8b5cf6' :
                  cat.color === 'orange' ? '#f97316' :
                  cat.color === 'green' ? '#10b981' :
                  cat.color === 'pink' ? '#ec4899' :
                  cat.color === 'red' ? '#ef4444' : '#64748b';

                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryChip,
                      isSelected && { backgroundColor: color + '30', borderColor: color },
                    ]}
                    onPress={() => toggleCategory(cat)}
                  >
                    <View style={[styles.categoryDot, { backgroundColor: color }]} />
                    <Text style={[
                      styles.categoryText,
                      isSelected && { color },
                    ]}>{cat.name}</Text>
                    {isSelected && (
                      <Icon name="check" size={12} color={color} style={styles.categoryCheck} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>

      {/* 保存按钮 */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Icon name="check" size={18} color="#fff" />
        <Text style={styles.saveButtonText}>保存修改</Text>
      </TouchableOpacity>

      {/* 删除按钮 */}
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => setShowDeleteConfirm(true)}
      >
        <Icon name="trash-alt" size={18} color="#ef4444" />
        <Text style={styles.deleteButtonText}>删除联系人</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpace} />

      {/* 删除确认弹窗 */}
      <Modal
        visible={showDeleteConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Icon name="exclamation-triangle" size={48} color="#ef4444" />
            <Text style={styles.modalTitle}>确认删除</Text>
            <Text style={styles.modalText}>
              确定要删除联系人 "{contact.name}" 吗？此操作不可撤销。
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDeleteConfirm(false)}
              >
                <Text style={styles.cancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmDeleteButton} 
                onPress={handleDelete}
              >
                <Text style={styles.confirmDeleteText}>删除</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputGroup: {
    paddingVertical: 8,
  },
  inputLabel: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 8,
  },
  input: {
    fontSize: 15,
    color: '#fff',
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  star: {
    marginHorizontal: 4,
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
  },
  favoriteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  favoriteLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  favoriteText: {
    fontSize: 15,
    color: '#fff',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#fbbf24',
    borderColor: '#fbbf24',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    paddingVertical: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(100, 116, 139, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 6,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  categoryCheck: {
    marginLeft: 2,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  bottomSpace: {
    height: 40,
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
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
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
  confirmDeleteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    alignItems: 'center',
  },
  confirmDeleteText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
});

export default EditContactScreen;
