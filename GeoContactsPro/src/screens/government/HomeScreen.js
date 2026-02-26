import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../../context/AppContext';

export default function GovernmentHomeScreen({ navigation }) {
  const { governmentData } = useApp();

  const stats = [
    { label: '在职人员', value: governmentData.personnel.length, icon: 'users', color: '#3b82f6' },
    { label: '执勤中', value: governmentData.personnel.filter(p => p.status === '执勤中').length, icon: 'user-check', color: '#10b981' },
    { label: '巡检中', value: governmentData.personnel.filter(p => p.status === '巡检中').length, icon: 'walking', color: '#f59e0b' },
    { label: '管控区域', value: governmentData.controlZones.length, icon: 'map-marked', color: '#8b5cf6' },
  ];

  const quickActions = [
    { label: '人员管理', icon: 'users-cog', screen: 'GovernmentOrg', color: '#3b82f6' },
    { label: '实时监管', icon: 'eye', screen: 'GovernmentMonitor', color: '#10b981' },
    { label: '数据统计', icon: 'chart-pie', screen: 'GovernmentStatistics', color: '#f59e0b' },
    { label: '预警消息', icon: 'bell', screen: 'Alerts', color: '#ef4444', badge: 2 },
  ];

  const recentAlerts = [
    { id: 1, type: 'zone', message: '张队长离开执勤区域A', time: '10分钟前', level: 'warning' },
    { id: 2, type: 'patrol', message: '执法一队完成巡检任务', time: '30分钟前', level: 'info' },
    { id: 3, type: 'enter', message: '李局长进入机关大楼', time: '1小时前', level: 'info' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{governmentData.organizationName}</Text>
          <Text style={styles.headerSubtitle}>政企时空管理系统</Text>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="cog" size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 统计卡片 */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                <Icon name={stat.icon} size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* 快捷操作 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>快捷操作</Text>
          <View style={styles.quickActions}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionButton}
                onPress={() => navigation.navigate(action.screen)}
              >
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                  <Icon name={action.icon} size={24} color={action.color} />
                  {action.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{action.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 最近预警 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>最近动态</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>查看全部</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.alertsContainer}>
            {recentAlerts.map((alert) => (
              <View key={alert.id} style={styles.alertItem}>
                <View style={[
                  styles.alertDot,
                  { backgroundColor: alert.level === 'warning' ? '#f59e0b' : '#3b82f6' }
                ]} />
                <View style={styles.alertContent}>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                  <Text style={styles.alertTime}>{alert.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 今日执勤概览 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>今日执勤概览</Text>
          <View style={styles.overviewCard}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>85%</Text>
              <Text style={styles.overviewLabel}>出勤率</Text>
            </View>
            <View style={styles.overviewDivider} />
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>12</Text>
              <Text style={styles.overviewLabel}>巡检任务</Text>
            </View>
            <View style={styles.overviewDivider} />
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>3</Text>
              <Text style={styles.overviewLabel}>异常事件</Text>
            </View>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
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
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
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
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
  actionLabel: {
    fontSize: 12,
    color: '#cbd5e1',
    textAlign: 'center',
  },
  alertsContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertMessage: {
    fontSize: 14,
    color: '#f8fafc',
    flex: 1,
  },
  alertTime: {
    fontSize: 12,
    color: '#64748b',
  },
  overviewCard: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-around',
  },
  overviewItem: {
    alignItems: 'center',
    flex: 1,
  },
  overviewDivider: {
    width: 1,
    backgroundColor: '#334155',
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  overviewLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
});
