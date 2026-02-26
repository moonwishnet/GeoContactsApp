import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../context/AppContext';

const CategoryManagerScreen = () => {
  const { categoryDimensions, addCategory, updateCategory, deleteCategory } = useApp();
  const [activeDimension, setActiveDimension] = useState('work');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [parentId, setParentId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');

  const colors = [
    { id: 'blue', value: '#3b82f6' },
    { id: 'purple', value: '#8b5cf6' },
    { id: 'orange', value: '#f97316' },
    { id: 'green', value: '#10b981' },
    { id: 'pink', value: '#ec4899' },
    { id: 'red', value: '#ef4444' },
    { id: 'yellow', value: '#fbbf24' },
    { id: 'slate', value: '#64748b' },
  ];

  // 打开添加分类弹窗
  const openAddModal = (parent = null) => {
    setEditingCategory(null);
    setParentId(parent);
    setCategoryName('');
    setSelectedColor('blue');
    setModalVisible(true);
  };

  // 打开编辑分类弹窗
  const openEditModal = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setSelectedColor(category.color || 'blue');
    setModalVisible(true);
  };

  // 保存分类
  const handleSave = () => {
    if (!categoryName.trim()) {
      Alert.alert('错误', '请输入分类名称');
      return;
    }

    if (editingCategory) {
      updateCategory(activeDimension, editingCategory.id, {
        name: categoryName.trim(),
        color: selectedColor,
      });
    } else {
      addCategory(activeDimension, parentId, {
        name: categoryName.trim(),
        color: selectedColor,
      });
    }

    setModalVisible(false);
    setCategoryName('');
    setEditingCategory(null);
    setParentId(null);
  };

  // 删除分类
  const handleDelete = (category) => {
    Alert.alert(
      '删除分类',
      `确定要删除 "${category.name}" 吗？\n注意：删除分类不会删除联系人，只会移除联系人的分类标记。`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => deleteCategory(activeDimension, category.id),
        },
      ]
    );
  };

  // 渲染分类树
  const renderCategoryTree = (nodes, level = 0) => {
    return nodes.map((node) => (
      <View key={node.id} style={[styles.categoryItem, { marginLeft: level * 20 }]}>
        <View style={styles.categoryRow}>
          <View style={styles.categoryLeft}>
            <View style={[styles.categoryDot, { backgroundColor: getColorValue(node.color) }]} />
            <Text style={styles.categoryName}>{node.name}</Text>
          </View>
          <View style={styles.categoryActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openAddModal(node.id)}
            >
              <Icon name="plus" size={14} color="#10b981" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openEditModal(node)}
            >
              <Icon name="edit" size={14} color="#3b82f6" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDelete(node)}
            >
              <Icon name="trash-alt" size={14} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
        {node.children && node.children.length > 0 && (
          <View style={styles.childrenContainer}>
            {renderCategoryTree(node.children, level + 1)}
          </View>
        )}
      </View>
    ));
  };

  // 获取颜色值
  const getColorValue = (colorId) => {
    const color = colors.find(c => c.id === colorId);
    return color?.value || '#3b82f6';
  };

  return (
    <View style={styles.container}>
      {/* 维度切换 */}
      <View style={styles.dimensionTabs}>
        <TouchableOpacity
          style={[
            styles.dimensionTab,
            activeDimension === 'work' && styles.dimensionTabActive,
          ]}
          onPress={() => setActiveDimension('work')}
        >
          <Icon
            name="briefcase"
            size={16}
            color={activeDimension === 'work' ? '#fff' : '#94a3b8'}
          />
          <Text style={[
            styles.dimensionTabText,
            activeDimension === 'work' && styles.dimensionTabTextActive,
          ]}>工作</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.dimensionTab,
            activeDimension === 'personal' && styles.dimensionTabActive,
          ]}
          onPress={() => setActiveDimension('personal')}
        >
          <Icon
            name="user-friends"
            size={16}
            color={activeDimension === 'personal' ? '#fff' : '#94a3b8'}
          />
          <Text style={[
            styles.dimensionTabText,
            activeDimension === 'personal' && styles.dimensionTabTextActive,
          ]}>私人</Text>
        </TouchableOpacity>
      </View>

      {/* 添加根分类按钮 */}
      <TouchableOpacity
        style={styles.addRootButton}
        onPress={() => openAddModal(null)}
      >
        <Icon name="plus" size={16} color="#fff" />
        <Text style={styles.addRootText}>添加根分类</Text>
      </TouchableOpacity>

      {/* 分类列表 */}
      <ScrollView style={styles.categoryList} showsVerticalScrollIndicator={false}>
        {categoryDimensions[activeDimension]?.tree.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="folder-open" size={48} color="#334155" />
            <Text style={styles.emptyText}>暂无分类</Text>
            <Text style={styles.emptySubtext}>点击上方按钮添加分类</Text>
          </View>
        ) : (
          renderCategoryTree(categoryDimensions[activeDimension]?.tree || [])
        )}
      </ScrollView>

      {/* 添加/编辑分类弹窗 */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingCategory ? '编辑分类' : '添加分类'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="分类名称"
              placeholderTextColor="#64748b"
              value={categoryName}
              onChangeText={setCategoryName}
              maxLength={20}
            />

            <Text style={styles.colorLabel}>选择颜色</Text>
            <View style={styles.colorGrid}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color.id}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color.value },
                    selectedColor === color.id && styles.colorOptionSelected,
                  ]}
                  onPress={() => setSelectedColor(color.id)}
                >
                  {selectedColor === color.id && (
                    <Icon name="check" size={16} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 16,
  },
  dimensionTabs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dimensionTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  dimensionTabActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  dimensionTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  dimensionTabTextActive: {
    color: '#fff',
  },
  addRootButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  addRootText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  categoryList: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#475569',
    marginTop: 8,
  },
  categoryItem: {
    marginBottom: 4,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 4,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  childrenContainer: {
    marginTop: 4,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
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
    marginBottom: 16,
  },
  colorLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#fff',
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
    backgroundColor: '#3b82f6',
    alignItems: 'center',
  },
  saveText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
});

export default CategoryManagerScreen;
