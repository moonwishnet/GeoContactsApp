import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../../context/AppContext';

const { width } = Dimensions.get('window');

export default function EnterpriseDataAnalysisScreen() {
  const [activeTab, setActiveTab] = useState('employee');
  const { enterpriseData } = useApp();

  const tabs = [
    { id: 'employee', label: '员工分析', icon: 'users' },
    { id: 'customer', label: '客户分析', icon: 'handshake' },
    { id: 'field', label: '外勤分析', icon: 'walking' },
  ];

  // 模拟数据
  const employeeStats = {
    totalEmployees: enterpriseData.employees.length,
    fieldEmployees: enterpriseData.employees.filter(e => e.status === '外勤').length,
    avgVisitsPerEmployee: 12,
    totalMileage: 1250,
  };

  const customerStats = {
    totalCustomers: enterpriseData.customers.length,
    newCustomers: 3,
    lostCustomers: 1,
    totalVisits: 45,
    visitCompletionRate: 88,
  };

  const fieldStats = {
    totalFieldDays: 120,
    dailyFieldRate: '85%',
    totalMileage: 3250,
    taskCompletionRate: '92%',
  };

  const employeeRankings = [
    { name: '孙销售', visits: 18, mileage: 420, deals: 5 },
    { name: '周客户', visits: 15, mileage: 380, deals: 3 },
    { name: '李前端', visits: 12, mileage: 250, deals: 2 },
    { name: '赵小明', visits: 10, mileage: 200, deals: 1 },
  ];

  const customerGroups = [
    { name: '老客户', count: 12, percentage: 60 },
    { name: '潜在客户', count: 6, percentage: 30 },
    { name: '流失客户', count: 2, percentage: 10 },
  ];

  const renderEmployeeAnalysis = () => (
    <>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{employeeStats.totalEmployees}</Text>
          <Text style={styles.statLabel}>员工总数</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{employeeStats.fieldEmployees}</Text>
          <Text style={styles.statLabel}>外勤人数</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{employeeStats.avgVisitsPerEmployee}</Text>
          <Text style={styles.statLabel}>人均拜访</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{employeeStats.totalMileage}</Text>
          <Text style={styles.statLabel}>总里程(km)</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>员工业绩排行</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>姓名</Text>
            <Text style={styles.tableHeaderCell}>拜访数</Text>
            <Text style={styles.tableHeaderCell}>里程</Text>
            <Text style={styles.tableHeaderCell}>成交</Text>
          </View>
          {employeeRankings.map((emp, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={[styles.tableCell, { flex: 1.5, flexDirection: 'row', alignItems: 'center' }]}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
                <Text style={[styles.tableCellText, { color: '#f8fafc', marginLeft: 8 }]}>{emp.name}</Text>
              </View>
              <Text style={styles.tableCell}>{emp.visits}</Text>
              <Text style={styles.tableCell}>{emp.mileage}</Text>
              <Text style={styles.tableCell}>{emp.deals}</Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );

  const renderCustomerAnalysis = () => (
    <>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{customerStats.totalCustomers}</Text>
          <Text style={styles.statLabel}>客户总数</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{customerStats.newCustomers}</Text>
          <Text style={styles.statLabel}>新增客户</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{customerStats.totalVisits}</Text>
          <Text style={styles.statLabel}>总拜访数</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{customerStats.visitCompletionRate}%</Text>
          <Text style={styles.statLabel}>拜访完成率</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>客户分布</Text>
        <View style={styles.customerGroups}>
          {customerGroups.map((group, index) => (
            <View key={index} style={styles.customerGroupItem}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupCount}>{group.count}家</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${group.percentage}%` }]} />
              </View>
              <Text style={styles.groupPercentage}>{group.percentage}%</Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );

  const renderFieldAnalysis = () => (
    <>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{fieldStats.totalFieldDays}</Text>
          <Text style={styles.statLabel}>外勤天数</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{fieldStats.dailyFieldRate}</Text>
          <Text style={styles.statLabel}>日均外勤率</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{fieldStats.totalMileage}</Text>
          <Text style={styles.statLabel}>总里程(km)</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{fieldStats.taskCompletionRate}</Text>
          <Text style={styles.statLabel}>任务完成率</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>本周外勤趋势</Text>
        <View style={styles.trendContainer}>
          {['周一', '周二', '周三', '周四', '周五'].map((day, index) => (
            <View key={index} style={styles.trendItem}>
              <View style={[styles.trendBar, { height: 40 + Math.random() * 60 }]} />
              <Text style={styles.trendLabel}>{day}</Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>数据分析</Text>
        <TouchableOpacity style={styles.exportButton}>
          <Icon name="file-export" size={16} color="#3b82f6" />
          <Text style={styles.exportText}>导出</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Icon name={tab.icon} size={16} color={activeTab === tab.id ? '#fff' : '#94a3b8'} />
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'employee' && renderEmployeeAnalysis()}
        {activeTab === 'customer' && renderCustomerAnalysis()}
        {activeTab === 'field' && renderFieldAnalysis()}
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
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#3b82f620',
    borderRadius: 6,
  },
  exportText: {
    fontSize: 12,
    color: '#3b82f6',
    marginLeft: 6,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    color: '#94a3b8',
    marginLeft: 6,
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 12,
  },
  tableContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#334155',
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
  },
  tableCellText: {
    fontSize: 13,
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  customerGroups: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
  },
  customerGroupItem: {
    marginBottom: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  groupName: {
    fontSize: 14,
    color: '#f8fafc',
  },
  groupCount: {
    fontSize: 14,
    color: '#94a3b8',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  groupPercentage: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  trendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    height: 150,
  },
  trendItem: {
    alignItems: 'center',
  },
  trendBar: {
    width: 30,
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  trendLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 8,
  },
});
