import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../../context/AppContext';

const EditContactScreen = ({ route, navigation }) => {
  const { contact } = route.params;
  const { updateContact, spatiotemporalTags } = useApp();
  
  const [name, setName] = useState(contact.name);
  const [phone, setPhone] = useState(contact.phone);
  const [location, setLocation] = useState(contact.location);
  const [context, setContext] = useState(contact.context);
  const [selectedTags, setSelectedTags] = useState(
    contact.tags.map(tagName => spatiotemporalTags.find(t => t.name === tagName)?.id).filter(Boolean)
  );
  const [relationship, setRelationship] = useState(contact.relationship);
  const [isFavorite, setIsFavorite] = useState(contact.isFavorite);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag.id)) {
      setSelectedTags(selectedTags.filter(id => id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag.id]);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('错误', '请输入联系人姓名');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('错误', '请输入联系电话');
      return;
    }

    updateContact(contact.id, {
      name: name.trim(),
      phone: phone.trim(),
      location: location.trim(),
      context: context.trim(),
      relationship,
      isFavorite,
      tags: selectedTags.map(tagId => spatiotemporalTags.find(t => t.id === tagId)?.name).filter(Boolean),
    });

    Alert.alert('成功', '联系人已更新', [{ text: '确定', onPress: () => navigation.goBack() }]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>基本信息</Text>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>姓名 *</Text>
            <TextInput style={styles.input} placeholder="请输入姓名" placeholderTextColor="#64748b" value={name} onChangeText={setName} maxLength={20} />
          </View>
          <View style={styles.divider} />
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>电话 *</Text>
            <TextInput style={styles.input} placeholder="请输入电话号码" placeholderTextColor="#64748b" value={phone} onChangeText={setPhone} keyboardType="phone-pad" maxLength={20} />
          </View>
          <View style={styles.divider} />
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>位置</Text>
            <TextInput style={styles.input} placeholder="例如：公司、家中" placeholderTextColor="#64748b" value={location} onChangeText={setLocation} maxLength={30} />
          </View>
          <View style={styles.divider} />
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>状态</Text>
            <TextInput style={styles.input} placeholder="例如：工作中、休息中" placeholderTextColor="#64748b" value={context} onChangeText={setContext} maxLength={30} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>关系等级</Text>
        <View style={styles.card}>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRelationship(star)}>
                <Icon name="star" size={28} color={star <= relationship ? '#fbbf24' : '#334155'} style={styles.star} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.favoriteRow} onPress={() => setIsFavorite(!isFavorite)}>
            <View style={styles.favoriteLeft}><Icon name="star" size={18} color="#fbbf24" /><Text style={styles.favoriteText}>标记为收藏</Text></View>
            <View style={[styles.checkbox, isFavorite && styles.checkboxActive]}>{isFavorite && <Icon name="check" size={12} color="#fff" />}</View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>标签</Text>
        <View style={styles.card}>
          <View style={styles.tagsGrid}>
            {spatiotemporalTags.map((tag) => (
              <TouchableOpacity key={tag.id} style={[styles.tagChip, selectedTags.includes(tag.id) && styles.tagChipActive]} onPress={() => toggleTag(tag)}>
                <Icon name={tag.icon} size={12} color={selectedTags.includes(tag.id) ? '#fff' : '#94a3b8'} />
                <Text style={[styles.tagChipText, selectedTags.includes(tag.id) && styles.tagChipTextActive]}>{tag.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Icon name="check" size={18} color="#fff" />
        <Text style={styles.saveButtonText}>保存修改</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 12 },
  card: { backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  inputGroup: { paddingVertical: 8, paddingHorizontal: 16 },
  inputLabel: { fontSize: 13, color: '#94a3b8', marginBottom: 8 },
  input: { fontSize: 15, color: '#fff', paddingVertical: 8 },
  divider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)', marginHorizontal: 16 },
  ratingContainer: { flexDirection: 'row', justifyContent: 'center', gap: 12, paddingVertical: 12 },
  star: { marginHorizontal: 4 },
  favoriteRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 16 },
  favoriteLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  favoriteText: { fontSize: 15, color: '#fff' },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#334155', justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: '#fbbf24', borderColor: '#fbbf24' },
  tagsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 16 },
  tagChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'rgba(100, 116, 139, 0.2)', borderRadius: 20, borderWidth: 1, borderColor: 'transparent', gap: 6 },
  tagChipActive: { backgroundColor: '#3b82f620', borderColor: '#3b82f6' },
  tagChipText: { fontSize: 13, color: '#94a3b8' },
  tagChipTextActive: { color: '#3b82f6' },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#3b82f6', borderRadius: 12, paddingVertical: 14, marginTop: 8 },
  saveButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  bottomSpace: { height: 40 },
});

export default EditContactScreen;
