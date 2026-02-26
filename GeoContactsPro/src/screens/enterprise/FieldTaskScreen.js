import React, { useState } from 'react';
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

export default function EnterpriseFieldTaskScreen() {
  const { enterpriseData, addFieldTask, updateFieldTask } = useApp();
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: '全部' },
    { id: 'pending', label: '待处理' },
    { id: 'inProgress', label: '进行中' },
    { id: 'completed', label: '已完成' },
  ];

  const tasks = enterpriseData.fieldTasks.length > 0 ? enterpriseData.fieldTasks : [
    {
      id: 'task-1',
      title: '拜访ABC科技公司',
      customerId: 'cust-1',
      assigneeId: 'emp-6',
      status: 'inProgress',
      priority: 'high',
      deadline: Date.now() + 2 * 24 * 60 * 60 * 1000,
      description: '跟进合作项目进展，洽谈续约事宜',
      location: '北京市朝阳区国贸大厦',
    },
    {
      id: 'task-2',
      title: 'XYZ贸易公司产品演示',
      customerId: 'cust-2',
      assigneeId: 'emp-7',
      status: 'pending',
      priority: 'medium',
      deadline: Date.now() + 5 * 24 * 60 * 60 * 1000,
      description: '进行产品功能演示，解答客户疑问',
      location: '北京市海淀区中关村',
    },
    {
      id: 'task-3',
      title: '新客户拓展-某制造厂',
      customerId: null,
      assigneeId: 'emp-6',
      status: 'completed',
      priority: 'low',
      deadline: Date.now() - 2 * 24 * 60 * 60 * 1000,
      description: '初次拜访，介绍公司产品和服务',
      location: '北京市亦庄开发区',
    },
  ];

  const filteredTasks = activeTab === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === activeTab);

  const getStatusText = (status) => {
    const statusMap = {
      pending: '待处理',
      inProgress: '进行中',
      completed: '已完成',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending: '#f59e0b',
      inProgress: '#3b82f6',
      completed: '#10b981',
    };
    return colorMap[status] || '#64748b';
  };

  const getPriorityText = (priority) => {
    const priorityMap = {
      high: '高',
      medium: '中',
      low: '低',
    };
    return priorityMap[priority] || priority;
  };

  const getPriorityColor = (priority) => {
    const colorMap = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981',
    };
    return colorMap[priority] || '#64748b';
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>外勤任务</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="plus" size={18} color="#fff" />
          <Text style={styles.addButtonText}>新建任务</Text>
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
        {/* 统计概览 */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{tasks.length}</Text>
            <Text style={styles.statLabel}>总任务</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{tasks.filter(t => t.status === 'pending').length}</Text>
            <Text style={styles.statLabel}>待处理</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{tasks.filter(t => t.status === 'inProgress').length}</Text>
            <Text style={styles.statLabel}>进行中</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{tasks.filter(t => t.status === 'completed').length}</Text>
            <Text style={styles.statLabel}>已完成</Text>
          </View>
        </View>

        {/* 任务列表 */}
        <View style={styles.taskList}>
          {filteredTasks.map(task => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor(task.priority)}20` }]}>
                  <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                    {getPriorityText(task.priority)}优先级
                  </Text>
                </View>
              </View>

              <Text style={styles.taskDescription}>{task.description}</Text>

              <View style={styles.taskDetails}>
                <View style={styles.detailItem}>
                  <Icon name="map-marker-alt" size={14} color="#64748b" />
                  <Text style={styles.detailText}>{task.location}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Icon name="calendar-alt" size={14} color="#64748b" />
                  <Text style={styles.detailText}>截止: {formatDate(task.deadline)}</Text>
                </View>
              </View>

              <View style={styles.taskFooter}>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(task.status)}20` }]}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(task.status) }]} />
                  <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>
                    {getStatusText(task.status)}
                  </Text>
                </View>

                <View style={styles.taskActions}>
                  {task.status !== 'completed' && (
                    <TouchableOpacity style={styles.actionButton}>
                      <Text style={styles.actionButtonText}>
                        {task.status === 'pending' ? '开始' : '完成'}
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.moreButton}>
                    <Icon name="ellipsis-h" size={16} color="#64748b" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    color: '#fff',
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#1e293b',
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
  taskList: {
    gap: 12,
  },
  taskCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '500',
  },
  taskDescription: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 12,
    lineHeight: 20,
  },
  taskDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 8,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  actionButtonText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
  },
  moreButton: {
    padding: 8,
  },
});
