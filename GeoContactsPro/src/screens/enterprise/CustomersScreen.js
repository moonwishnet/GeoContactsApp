import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../../context/AppContext';
import { navigateToLocation } from '../../utils/communication';

const CustomersScreen = () => {
  const { enterpriseData, defaultNavigation } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');

  const groups = ['all', '潜在客户', '老客户'];

  const filteredCustomers = enterpriseData.customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.contactName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroup === 'all' || customer.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const handleNavigate = (customer) => {
    navigateToLocation(customer.latitude, customer.longitude, customer.name, defaultNavigation);
  };

  return (
    <View style={styles.container}>
      {/* 搜索栏 */}
      <View style={styles.searchBar}>
        <Icon name="search" size={16} color="#64748b" />
        <TextInput
          style={styles.searchInput}
          placeholder="搜索客户..."
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* 分组筛选 */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {groups.map(group => (
            <TouchableOpacity
              key={group}
              style={[styles.filterChip, selectedGroup === group && styles.filterChipActive]}
              onPress={() => setSelectedGroup(group)}
            >
              <Text style={[styles.filterChipText, selectedGroup === group && styles.filterChipTextActive]}>
                {group === 'all' ? '全部' : group}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 客户列表 */}
      <FlatList
        data={filteredCustomers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.customerCard}>
            <View style={styles.customerHeader}>
              <View style={styles.customerAvatar}>
                <Text style={styles.customerAvatarText}>{item.name[0]}</Text>
              </View>
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{item.name}</Text>
                <Text style={styles.customerContact}>{item.contactName} · {item.phone}</Text>
              </View>
              <View style={[styles.statusBadge, item.visitStatus === '已拜访' ? styles.statusVisited : styles.statusUnvisited]}>
                <Text style={styles.statusText}>{item.visitStatus}</Text>
              </View>
            </View>
            
            <View style={styles.customerDetails}>
              <View style={styles.detailItem}>
                <Icon name="map-marker-alt" size={14} color="#64748b" />
                <Text style={styles.detailText}>{item.address}</Text>
              </View>
              <View style={styles.detailItem}>
                <Icon name="tag" size={14} color="#64748b" />
                <Text style={styles.detailText}>{item.group}</Text>
              </View>
            </View>

            <View style={styles.customerActions}>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleNavigate(item)}>
                <Icon name="location-arrow" size={14} color="#3b82f6" />
                <Text style={styles.actionButtonText}>导航</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="phone" size={14} color="#10b981" />
                <Text style={styles.actionButtonText}>电话</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
      />

      {/* 添加按钮 */}
      <TouchableOpacity style={styles.fab}>
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, margin: 16,
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#fff' },
  filterBar: { paddingHorizontal: 16, marginBottom: 12 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 8, backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterChipActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  filterChipText: { fontSize: 13, color: '#94a3b8' },
  filterChipTextActive: { color: '#fff', fontWeight: '600' },
  list: { padding: 16, paddingBottom: 80 },
  customerCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 16, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  customerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  customerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  customerAvatarText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  customerInfo: { flex: 1 },
  customerName: { fontSize: 16, fontWeight: '600', color: '#fff' },
  customerContact: { fontSize: 13, color: '#64748b', marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusVisited: { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
  statusUnvisited: { backgroundColor: 'rgba(100, 116, 139, 0.3)' },
  statusText: { fontSize: 11, fontWeight: '500' },
  customerDetails: { marginBottom: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  detailText: { fontSize: 13, color: '#94a3b8', marginLeft: 8 },
  customerActions: { flexDirection: 'row', gap: 12 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'rgba(59, 130, 246, 0.2)', borderRadius: 8 },
  actionButtonText: { fontSize: 13, color: '#3b82f6' },
  fab: {
    position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
});

export default CustomersScreen;
