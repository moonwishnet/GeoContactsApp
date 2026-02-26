import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../../context/AppContext';

const OrgScreen = () => {
  const { enterpriseData } = useApp();
  const [expandedDepts, setExpandedDepts] = useState({});

  const toggleDept = (deptId) => {
    setExpandedDepts(prev => ({ ...prev, [deptId]: !prev[deptId] }));
  };

  const renderDepartment = (dept, level = 0) => {
    const isExpanded = expandedDepts[dept.id];
    const childDepts = enterpriseData.departments.filter(d => d.parentId === dept.id);
    const deptEmployees = enterpriseData.employees.filter(e => dept.employees.includes(e.id));

    return (
      <View key={dept.id} style={[styles.deptItem, { marginLeft: level * 20 }]}>
        <TouchableOpacity style={styles.deptHeader} onPress={() => toggleDept(dept.id)}>
          <Icon name={isExpanded ? 'chevron-down' : 'chevron-right'} size={14} color="#64748b" />
          <Icon name="folder" size={16} color="#3b82f6" style={styles.deptIcon} />
          <Text style={styles.deptName}>{dept.name}</Text>
          <Text style={styles.deptCount}>({deptEmployees.length}人)</Text>
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.deptContent}>
            {deptEmployees.map(emp => (
              <View key={emp.id} style={styles.employeeItem}>
                <View style={styles.employeeAvatar}><Text style={styles.employeeAvatarText}>{emp.name[0]}</Text></View>
                <View style={styles.employeeInfo}>
                  <Text style={styles.employeeName}>{emp.name}</Text>
                  <Text style={styles.employeePosition}>{emp.position}</Text>
                </View>
                {emp.isManager && <View style={styles.managerBadge}><Text style={styles.managerText}>主管</Text></View>}
              </View>
            ))}
            {childDepts.map(child => renderDepartment(child, level + 1))}
          </View>
        )}
      </View>
    );
  };

  const rootDepts = enterpriseData.departments.filter(d => !d.parentId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>组织架构</Text>
        <Text style={styles.headerSubtitle}>{enterpriseData.departments.length}个部门 · {enterpriseData.employees.length}人</Text>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {rootDepts.map(dept => renderDepartment(dept))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.1)' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 13, color: '#64748b', marginTop: 4 },
  content: { flex: 1, padding: 16 },
  deptItem: { marginBottom: 4 },
  deptHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 8 },
  deptIcon: { marginHorizontal: 8 },
  deptName: { fontSize: 15, fontWeight: '600', color: '#fff', flex: 1 },
  deptCount: { fontSize: 12, color: '#64748b' },
  deptContent: { marginTop: 4, marginLeft: 20 },
  employeeItem: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: 8, marginBottom: 4 },
  employeeAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  employeeAvatarText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
  employeeInfo: { flex: 1 },
  employeeName: { fontSize: 14, color: '#fff' },
  employeePosition: { fontSize: 12, color: '#64748b', marginTop: 2 },
  managerBadge: { paddingHorizontal: 8, paddingVertical: 2, backgroundColor: 'rgba(245, 158, 11, 0.2)', borderRadius: 10 },
  managerText: { fontSize: 10, color: '#f59e0b' },
});

export default OrgScreen;
