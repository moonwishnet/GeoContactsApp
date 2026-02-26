import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../../context/AppContext';

const HomeScreen = ({ navigation }) => {
  const { enterpriseData } = useApp();
  
  const stats = {
    departments: enterpriseData.departments.length,
    employees: enterpriseData.employees.length,
    customers: enterpriseData.customers.length,
  };

  const quickActions = [
    { icon: 'sitemap', title: '组织架构', color: '#3b82f6', onPress: () => navigation.navigate('组织') },
    { icon: 'clock', title: '外勤打卡', color: '#10b981', onPress: () => navigation.navigate('打卡') },
    { icon: 'handshake', title: '客户管理', color: '#f59e0b', onPress: () => navigation.navigate('客户') },
    { icon: 'users', title: '员工管理', color: '#8b5cf6', onPress: () => {} },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.companyCard}>
        <View style={styles.companyHeader}>
          <View style={styles.companyLogo}><Icon name="building" size={32} color="#3b82f6" /></View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{enterpriseData.companyName}</Text>
            <Text style={styles.companySubtitle}>企业版</Text>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}><Text style={styles.statNumber}>{stats.departments}</Text><Text style={styles.statLabel}>部门</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}><Text style={styles.statNumber}>{stats.employees}</Text><Text style={styles.statLabel}>员工</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}><Text style={styles.statNumber}>{stats.customers}</Text><Text style={styles.statLabel}>客户</Text></View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>快捷操作</Text>
        <View style={styles.quickActions}>
          {quickActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.quickAction} onPress={action.onPress}>
              <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}><Icon name={action.icon} size={24} color={action.color} /></View>
              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  companyCard: { margin: 16, backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  companyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  companyLogo: { width: 56, height: 56, borderRadius: 12, backgroundColor: 'rgba(59, 130, 246, 0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  companyInfo: { flex: 1 },
  companyName: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  companySubtitle: { fontSize: 13, color: '#94a3b8' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'rgba(15, 23, 42, 0.5)', borderRadius: 12, paddingVertical: 16 },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#64748b' },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255, 255, 255, 0.1)' },
  section: { marginHorizontal: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 12 },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickAction: { width: '23%', alignItems: 'center' },
  quickActionIcon: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  quickActionText: { fontSize: 12, color: '#94a3b8' },
});

export default HomeScreen;
