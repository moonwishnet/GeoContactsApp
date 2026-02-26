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

export default function AuthorizationLogScreen() {
  const { privacySettings } = useApp();
  const [filter, setFilter] = useState('all');

  const filters = [
    { id: 'all', label: '全部' },
    { id: 'location', label: '位置' },
    { id: 'contact', label: '联系人' },
    { id: 'data', label: '数据' },
  ];

  // 模拟授权日志数据
  const logs = [
    {
      id: 1,
      type: 'location',
      action: '位置共享授权',
      target: '张三',
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      status: 'active',
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    },
    {
      id: 2,
      type: 'contact',
      action: '联系人访问授权',
      target: '企业版',
      timestamp: Date.now() - 24 * 60 * 60 * 1000,
      status: 'active',
      expiresAt: null,
    },
    {
      id: 3,
      type: 'data',
      action: '数据导出授权',
      target: '本地存储',
      timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
      status: 'expired',
      expiresAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    {
      id: 4,
      type: 'location',
      action: '实时位置授权',
      target: '亲情守护',
      timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
      status: 'active',
      expiresAt: null,
    },
    {
      id: 5,
      type: 'data',
      action: '云端备份授权',
      target: '云服务器',
      timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
      status: 'revoked',
      expiresAt: null,
    },
  ];

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.type === filter);

  const getTypeIcon = (type) => {
    const iconMap = {
      location: 'map-marker-alt',
      contact: 'address-book',
      data: 'database',
    };
    return iconMap[type] || 'info-circle';
  };

  const getTypeColor = (type) => {
    const colorMap = {
      location: '#3b82f6',
      contact: '#10b981',
      data: '#f59e0b',
    };
    return colorMap[type] || '#64748b';
  };

  const getStatusText = (status) => {
    const statusMap = {
      active: '有效',
      expired: '已过期',
      revoked: '已撤销',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      active: '#10b981',
      expired: '#64748b',
      revoked: '#ef4444',
    };
    return colorMap[status] || '#64748b';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>授权日志</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="trash-alt" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {/* 筛选标签 */}
      <View style={styles.filterContainer}>
        {filters.map(f => (
          <TouchableOpacity
            key={f.id}
            style={[styles.filterBtn, filter === f.id && styles.filterBtnActive]}
            onPress={() => setFilter(f.id)}
          >
            <Text style={[styles.filterBtnText, filter === f.id && styles.filterBtnTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 统计卡片 */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{logs.filter(l => l.status === 'active').length}</Text>
            <Text style={styles.statLabel}>有效授权</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{logs.length}</Text>
            <Text style={styles.statLabel}>总记录</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{logs.filter(l => l.status === 'expired').length}</Text>
            <Text style={styles.statLabel}>已过期</Text>
          </View>
        </View>

        {/* 日志列表 */}
        <View style={styles.logsList}>
          {filteredLogs.map(log => (
            <View key={log.id} style={styles.logCard}>
              <View style={styles.logHeader}>
                <View style={[styles.logIcon, { backgroundColor: `${getTypeColor(log.type)}20` }]}>
                  <Icon name={getTypeIcon(log.type)} size={18} color={getTypeColor(log.type)} />
                </View>
                <View style={styles.logInfo}>
                  <Text style={styles.logAction}>{log.action}</Text>
                  <Text style={styles.logTarget}>{log.target}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(log.status)}20` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(log.status) }]}>
                    {getStatusText(log.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.logDetails}>
                <View style={styles.detailItem}>
                  <Icon name="clock" size={12} color="#64748b" />
                  <Text style={styles.detailText}>授权时间: {formatTime(log.timestamp)}</Text>
                </View>
                {log.expiresAt && (
                  <View style={styles.detailItem}>
                    <Icon name="hourglass-end" size={12} color="#64748b" />
                    <Text style={styles.detailText}>
                      过期时间: {log.status === 'expired' ? '已过期' : formatTime(log.expiresAt)}
                    </Text>
                  </View>
                )}
              </View>

              {log.status === 'active' && (
                <View style={styles.logActions}>
                  <TouchableOpacity style={styles.revokeButton}>
                    <Text style={styles.revokeButtonText}>撤销授权</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* 隐私提示 */}
        <View style={styles.privacyNotice}>
          <Icon name="shield-alt" size={16} color="#3b82f6" />
          <Text style={styles.privacyNoticeText}>
            您的授权记录仅保存在本地，可随时查看和管理
          </Text>
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
    backgroundColor: '#ef444420',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    marginHorizontal: 4,
  },
  filterBtnActive: {
    backgroundColor: '#3b82f6',
  },
  filterBtnText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  filterBtnTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
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
  logsList: {
    gap: 12,
  },
  logCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logInfo: {
    flex: 1,
    marginLeft: 12,
  },
  logAction: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f8fafc',
  },
  logTarget: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  logDetails: {
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
  logActions: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 12,
  },
  revokeButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ef444420',
    borderRadius: 6,
  },
  revokeButtonText: {
    fontSize: 13,
    color: '#ef4444',
    fontWeight: '500',
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 20,
    marginBottom: 40,
  },
  privacyNoticeText: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 8,
  },
});
