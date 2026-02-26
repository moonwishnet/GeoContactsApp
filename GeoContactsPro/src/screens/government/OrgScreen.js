import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../../context/AppContext';

export default function GovernmentOrgScreen() {
  const { governmentData } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDepts, setExpandedDepts] = useState(['gov-dept-1']);

  const toggleDepartment = (deptId) => {
    setExpandedDepts(prev => 
      prev.includes(deptId) 
        ? prev.filter(id => id !== deptId)
        : [...prev, deptId]
    );
  };

  const getDepartmentPersonnel = (deptId) => {
    return governmentData.personnel.filter(p => p.departmentId === deptId);
  };

  const renderDepartment = (dept, level = 0) => {
    const isExpanded = expandedDepts.includes(dept.id);
    const personnel = getDepartmentPersonnel(dept.id);
    const childDepts = governmentData.departments.filter(d => d.parentId === dept.id);

    return (
      <View key={dept.id} style={[styles.departmentContainer, { marginLeft: level * 16 }]}>
        <TouchableOpacity 
          style={styles.departmentHeader}
          onPress={() => toggleDepartment(dept.id)}
        >
          <Icon 
            name={isExpanded ? 'chevron-down' : 'chevron-right'} 
            size={14} 
            color="#64748b" 
          />
          <Icon name="building" size={16} color="#3b82f6" style={styles.deptIcon} />
          <Text style={styles.departmentName}>{dept.name}</Text>
          <Text style={styles.personnelCount}>({personnel.length}人)</Text>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.departmentContent}>
            {personnel.map(person => (
              <View key={person.id} style={styles.personnelCard}>
                <View style={styles.personnelHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{person.name[0]}</Text>
                  </View>
                  <View style={styles.personnelInfo}>
                    <Text style={styles.personnelName}>{person.name}</Text>
                    <Text style={styles.personnelPosition}>{person.position}</Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: person.status === '执勤中' ? '#10b98120' : '#f59e0b20' }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: person.status === '执勤中' ? '#10b981' : '#f59e0b' }
                    ]}>
                      {person.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.personnelDetails}>
                  <View style={styles.detailItem}>
                    <Icon name="phone" size={12} color="#64748b" />
                    <Text style={styles.detailText}>{person.phone}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Icon name="map-marker-alt" size={12} color="#64748b" />
                    <Text style={styles.detailText}>{person.workLocation}</Text>
                  </View>
                </View>
              </View>
            ))}
            {childDepts.map(childDept => renderDepartment(childDept, level + 1))}
          </View>
        )}
      </View>
    );
  };

  const rootDepts = governmentData.departments.filter(d => !d.parentId);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>组织架构</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="plus" size={18} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={16} color="#64748b" />
        <TextInput
          style={styles.searchInput}
          placeholder="搜索人员或部门..."
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{governmentData.departments.length}</Text>
            <Text style={styles.statLabel}>部门</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{governmentData.personnel.length}</Text>
            <Text style={styles.statLabel}>人员</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {governmentData.personnel.filter(p => p.status === '执勤中').length}
            </Text>
            <Text style={styles.statLabel}>执勤中</Text>
          </View>
        </View>

        <View style={styles.orgContainer}>
          {rootDepts.map(dept => renderDepartment(dept))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    color: '#f8fafc',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  orgContainer: {
    padding: 16,
    paddingTop: 0,
  },
  departmentContainer: {
    marginBottom: 8,
  },
  departmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#1e293b',
    borderRadius: 8,
  },
  deptIcon: {
    marginHorizontal: 8,
  },
  departmentName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f8fafc',
    flex: 1,
  },
  personnelCount: {
    fontSize: 12,
    color: '#64748b',
  },
  departmentContent: {
    paddingTop: 8,
  },
  personnelCard: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  personnelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  personnelInfo: {
    flex: 1,
    marginLeft: 12,
  },
  personnelName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f8fafc',
  },
  personnelPosition: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  personnelDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#94a3b8',
    marginLeft: 4,
  },
});
