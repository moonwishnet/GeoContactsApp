import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../context/AppContext';

const AddContactScreen = ({ navigation }) => {
  const { addContact, categoryDimensions } = useApp();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [context, setContext] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [relationship, setRelationship] = useState(3);
  const [isFavorite, setIsFavorite] = useState(false);

  // 获取所有可选分类
  const getAllCategories = () => {
    const categories = [];
    ['work', 'personal'].forEach(dim => {
      const tree = categoryDimensions[dim]?.tree || [];
      const collect = (nodes, dimKey) => {
        nodes.forEach(node => {
          categories.push({ ...node, dimension: dimKey });
          if (node.children) {
            collect(node.children, dimKey);
          }
        });
      };
      collect(tree, dim);
    });
    return categories;
  };

  // 切换分类选择
  const toggleCategory = (category) => {
    const exists = selectedCategories.find(c => c.id === category.id);
    if (exists) {
      setSelectedCategories(selectedCategories.filter(c => c.id !== category.id));
    } else {
      setSelectedCategories([...selectedCategories, category]);
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

    const newContact = {
      name: name.trim(),
      phone: phone.trim(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.trim()}`,
      distance: Math.random() * 10,
      distanceUnit: 'km',
      relationship,
      status: 'offline',
      location: location.trim() || '未知位置',
      latitude: 39.9042 + (Math.random() - 0.5) * 0.1,
      longitude: 116.4074 + (Math.random() - 0.5) * 0.1,
      isFavorite,
      context: context.trim() || '暂无状态',
      bestTime: '随时',
      lastContact: null,
      categories: selectedCategories.map(cat => ({
        dim: cat.dimension,
        nodeId: cat.id,
        path: [cat.name],
      })),
      tags: [],
    };

    addContact(newContact);
    Alert.alert('成功', '联系人已添加', [
      { text: '确定', onPress: () => navigation.goBack() },
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
                const isSelected = selectedCategories.find(c => c.id === cat.id);
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
        <Text style={styles.saveButtonText}>保存联系人</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpace} />
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
  bottomSpace: {
    height: 40,
  },
});

export default AddContactScreen;
