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

export default function GovernmentStatisticsScreen() {
  const [activeTab, setActiveTab] = useState('daily');
  const { governmentData } = useApp();

  const tabs = [
    { id: 'daily', label: '日报' },
    { id: 'weekly', label: '周报' },
    { id: 'monthly', label: '月报' },
  ];

  const stats = {
    daily: {
      attendance: { value: '95%', change: '+2%' },
      patrolCompletion: { value: '88%', change: '+5%' },
      alertCount: { value: '3', change: '-1' },
      avgResponseTime: { value: '4.2分', change: '-0.5分' },
    },
    weekly: {
      attendance: { value: '93%', change: '+1%' },
      patrolCompletion: { value: '91%', change: '+3%' },
      alertCount: { value: '18', change: '-5' },
      avgResponseTime: { value: '4.5分', change: '-0.3分' },
    },
    monthly: {
      attendance: { value: '92%', change: '+2%' },
      patrolCompletion: { value: '89%', change: '+4%' },
      alertCount: { value: '72', change: '-12' },
      avgResponseTime: { value: '4.8分', change: '-0.8分' },
    },
  };

  const departmentStats = [
    { name: '领导办公室', attendance: 98, patrol: 100, alerts: 0 },
    { name: '综合管理部', attendance: 94, patrol: 92, alerts: 2 },
    { name: '执法一队', attendance: 92, patrol: 88, alerts: 5 },
    { name: '执法二队', attendance: 90, patrol: 85, alerts: 3 },
  ];

  const recentReports = [
    { id: 1, name: '2024年2月24日日报', date: '2024-02-24', type: 'daily' },
    { id: 2, name: '2024年2月第3周周报', date: '2024-02-18', type: 'weekly' },
    { id: 3, name: '2024年1月月报', date: '2024-01-31', type: 'monthly' },
  ];

  const currentStats = stats[activeTab];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>数据统计</Text>
        <TouchableOpacity style={styles.exportButton}>
          <Icon name="file-export" size={16} color="#3b82f6" />
          <Text style={styles.exportText}>导出报表</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 核心指标 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>核心指标</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>出勤率</Text>
              <Text style={styles.statValue}>{currentStats.attendance.value}</Text>
              <Text style={[styles.statChange, { color: '#10b981' }]}>
                {currentStats.attendance.change}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>巡检完成率</Text>
              <Text style={styles.statValue}>{currentStats.patrolCompletion.value}</Text>
              <Text style={[styles.statChange, { color: '#10b981' }]}>
                {currentStats.patrolCompletion.change}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>预警次数</Text>
              <Text style={styles.statValue}>{currentStats.alertCount.value}</Text>
              <Text style={[styles.statChange, { color: '#10b981' }]}>
                {currentStats.alertCount.change}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>平均响应时间</Text>
              <Text style={styles.statValue}>{currentStats.avgResponseTime.value}</Text>
              <Text style={[styles.statChange, { color: '#10b981' }]}>
                {currentStats.avgResponseTime.change}
              </Text>
            </View>
          </View>
        </View>

        {/* 部门统计 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>部门统计</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>部门</Text>
              <Text style={styles.tableHeaderCell}>出勤率</Text>
              <Text style={styles.tableHeaderCell}>巡检率</Text>
              <Text style={styles.tableHeaderCell}>预警</Text>
            </View>
            {departmentStats.map((dept, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2, color: '#f8fafc' }]}>{dept.name}</Text>
                <Text style={styles.tableCell}>{dept.attendance}%</Text>
                <Text style={styles.tableCell}>{dept.patrol}%</Text>
                <Text style={styles.tableCell}>{dept.alerts}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 历史报表 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>历史报表</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>查看全部</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.reportsList}>
            {recentReports.map(report => (
              <TouchableOpacity key={report.id} style={styles.reportItem}>
                <View style={styles.reportIcon}>
                  <Icon 
                    name={report.type === 'daily' ? 'calendar-day' : report.type === 'weekly' ? 'calendar-week' : 'calendar-alt'} 
                    size={20} 
                    color="#3b82f6" 
                  />
                </View>
                <View style={styles.reportInfo}>
                  <Text style={styles.reportName}>{report.name}</Text>
                  <Text style={styles.reportDate}>{report.date}</Text>
                </View>
                <Icon name="chevron-right" size={16} color="#64748b" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 快捷操作 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>快捷操作</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionBtn}>
              <Icon name="file-alt" size={20} color="#3b82f6" />
              <Text style={styles.quickActionText}>生成日报</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionBtn}>
              <Icon name="chart-line" size={20} color="#10b981" />
              <Text style={styles.quickActionText}>趋势分析</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionBtn}>
              <Icon name="file-pdf" size={20} color="#ef4444" />
              <Text style={styles.quickActionText}>导出PDF</Text>
            </TouchableOpacity>
          </View>
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
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 12,
  },
  viewAll: {
    fontSize: 12,
    color: '#3b82f6',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
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
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
  },
  reportsList: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  reportIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#3b82f620',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportInfo: {
    flex: 1,
    marginLeft: 12,
  },
  reportName: {
    fontSize: 14,
    color: '#f8fafc',
    marginBottom: 2,
  },
  reportDate: {
    fontSize: 12,
    color: '#64748b',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  quickActionText: {
    fontSize: 13,
    color: '#f8fafc',
    marginLeft: 8,
  },
});
