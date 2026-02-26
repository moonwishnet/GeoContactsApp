import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../context/AppContext';
import { formatDateTime } from '../utils/time';

const { width } = Dimensions.get('window');

// 模拟时空轨迹数据
const generateTimelineData = (contacts) => {
  const events = [];
  const now = Date.now();
  
  contacts.forEach(contact => {
    // 为每个联系人生成一些轨迹事件
    const eventCount = Math.floor(Math.random() * 5) + 2;
    for (let i = 0; i < eventCount; i++) {
      const timeOffset = Math.random() * 7 * 24 * 60 * 60 * 1000; // 7天内
      events.push({
        id: `${contact.id}-${i}`,
        contactId: contact.id,
        contactName: contact.name,
        contactAvatar: contact.avatar,
        type: ['call', 'meet', 'message'][Math.floor(Math.random() * 3)],
        timestamp: now - timeOffset,
        location: contact.location,
        duration: Math.floor(Math.random() * 30) + 5,
        notes: '',
      });
    }
  });
  
  return events.sort((a, b) => b.timestamp - a.timestamp);
};

// 模拟热力图数据
const generateHeatmapData = () => {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    // 模拟不同时段的活跃度
    let baseActivity = 0.3;
    if (i >= 9 && i <= 18) baseActivity = 0.7; // 工作时间
    if (i >= 12 && i <= 13) baseActivity = 0.9; // 午餐时间
    if (i >= 19 && i <= 22) baseActivity = 0.8; // 晚上
    
    hours.push({
      hour: i,
      activity: Math.min(1, baseActivity + (Math.random() * 0.3 - 0.15)),
    });
  }
  return hours;
};

// AI预测数据
const aiPredictions = [
  {
    id: '1',
    contactName: '张三',
    type: '可能联系',
    reason: '距离上次联系已过去2天，历史模式显示每2-3天会联系一次',
    probability: 0.85,
    suggestedTime: '今天 18:30',
  },
  {
    id: '2',
    contactName: '李四',
    type: '可能见面',
    reason: '距离您仅2.5km，且通常在周末下午会见面',
    probability: 0.72,
    suggestedTime: '周六 15:00',
  },
  {
    id: '3',
    contactName: '王五',
    type: '可能联系',
    reason: '项目即将截止，预计会讨论进度',
    probability: 0.68,
    suggestedTime: '明天 10:00',
  },
];

const TimelineScreen = () => {
  const { contacts } = useApp();
  const [activeTab, setActiveTab] = useState('timeline');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const timelineEvents = useMemo(() => generateTimelineData(contacts), [contacts]);
  const heatmapData = useMemo(() => generateHeatmapData(), []);

  const getEventIcon = (type) => {
    switch (type) {
      case 'call': return 'phone';
      case 'meet': return 'handshake';
      case 'message': return 'comment';
      default: return 'circle';
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'call': return '#3b82f6';
      case 'meet': return '#10b981';
      case 'message': return '#f59e0b';
      default: return '#64748b';
    }
  };

  const getEventText = (type) => {
    switch (type) {
      case 'call': return '电话';
      case 'meet': return '见面';
      case 'message': return '消息';
      default: return '其他';
    }
  };

  const filteredEvents = useMemo(() => {
    if (selectedFilter === 'all') return timelineEvents;
    return timelineEvents.filter(e => e.type === selectedFilter);
  }, [timelineEvents, selectedFilter]);

  // 渲染时间轴
  const renderTimeline = () => (
    <View style={styles.timelineContainer}>
      {/* 筛选器 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {[
          { id: 'all', label: '全部', icon: 'list' },
          { id: 'call', label: '电话', icon: 'phone' },
          { id: 'meet', label: '见面', icon: 'handshake' },
          { id: 'message', label: '消息', icon: 'comment' },
        ].map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              selectedFilter === filter.id && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Icon
              name={filter.icon}
              size={12}
              color={selectedFilter === filter.id ? '#fff' : '#94a3b8'}
            />
            <Text style={[
              styles.filterChipText,
              selectedFilter === filter.id && styles.filterChipTextActive,
            ]}>{filter.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 时间轴列表 */}
      <ScrollView style={styles.timelineScroll} showsVerticalScrollIndicator={false}>
        {filteredEvents.map((event, index) => {
          const isFirst = index === 0;
          const prevDate = !isFirst ? new Date(filteredEvents[index - 1].timestamp).toDateString() : null;
          const currDate = new Date(event.timestamp).toDateString();
          const showDateHeader = isFirst || prevDate !== currDate;

          return (
            <View key={event.id}>
              {showDateHeader && (
                <View style={styles.dateHeader}>
                  <Text style={styles.dateHeaderText}>
                    {new Date(event.timestamp).toLocaleDateString('zh-CN', {
                      month: 'long',
                      day: 'numeric',
                      weekday: 'short',
                    })}
                  </Text>
                </View>
              )}
              <View style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineDot, { backgroundColor: getEventColor(event.type) }]}>
                    <Icon name={getEventIcon(event.type)} size={10} color="#fff" />
                  </View>
                  {index < filteredEvents.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineContent}>
                  <View style={styles.timelineHeader}>
                    <Text style={styles.timelineTime}>
                      {formatDateTime(event.timestamp).split(' ')[1]}
                    </Text>
                    <View style={[styles.timelineBadge, { backgroundColor: getEventColor(event.type) + '20' }]}>
                      <Text style={[styles.timelineBadgeText, { color: getEventColor(event.type) }]}>
                        {getEventText(event.type)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.timelineCard}>
                    <View style={styles.timelineAvatar}>
                      <Text style={styles.timelineAvatarText}>{event.contactName[0]}</Text>
                    </View>
                    <View style={styles.timelineInfo}>
                      <Text style={styles.timelineName}>{event.contactName}</Text>
                      <Text style={styles.timelineLocation}>
                        <Icon name="map-marker-alt" size={10} color="#64748b" /> {event.location}
                      </Text>
                      {event.type === 'call' && (
                        <Text style={styles.timelineDetail}>
                          通话时长: {event.duration}分钟
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );

  // 渲染热力图
  const renderHeatmap = () => (
    <View style={styles.heatmapContainer}>
      <Text style={styles.sectionTitle}>活跃时段分布</Text>
      <Text style={styles.sectionSubtitle}>基于您的联系历史分析</Text>
      
      <View style={styles.heatmapGrid}>
        {heatmapData.map((hour, index) => (
          <View
            key={index}
            style={[
              styles.heatmapCell,
              { backgroundColor: `rgba(59, 130, 246, ${hour.activity})` },
            ]}
          >
            <Text style={styles.heatmapHour}>{hour.hour}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.heatmapLegend}>
        <Text style={styles.legendText}>低活跃</Text>
        <View style={styles.legendGradient}>
          <View style={[styles.legendBox, { opacity: 0.2 }]} />
          <View style={[styles.legendBox, { opacity: 0.4 }]} />
          <View style={[styles.legendBox, { opacity: 0.6 }]} />
          <View style={[styles.legendBox, { opacity: 0.8 }]} />
          <View style={[styles.legendBox, { opacity: 1 }]} />
        </View>
        <Text style={styles.legendText}>高活跃</Text>
      </View>

      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Icon name="lightbulb" size={16} color="#f59e0b" />
          <Text style={styles.insightTitle}>智能洞察</Text>
        </View>
        <Text style={styles.insightText}>
          您在午餐时间(12:00-13:00)和晚上(19:00-22:00)联系频率最高，
          建议在这些时段安排重要沟通。
        </Text>
      </View>
    </View>
  );

  // 渲染AI预测
  const renderAIPredictions = () => (
    <View style={styles.predictionsContainer}>
      <View style={styles.aiHeader}>
        <Icon name="robot" size={20} color="#3b82f6" />
        <Text style={styles.aiTitle}>AI 智能预测</Text>
      </View>
      <Text style={styles.aiSubtitle}>基于您的联系模式分析</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {aiPredictions.map(prediction => (
          <View key={prediction.id} style={styles.predictionCard}>
            <View style={styles.predictionHeader}>
              <View style={styles.predictionAvatar}>
                <Text style={styles.predictionAvatarText}>
                  {prediction.contactName[0]}
                </Text>
              </View>
              <View style={styles.predictionInfo}>
                <Text style={styles.predictionName}>{prediction.contactName}</Text>
                <Text style={styles.predictionType}>{prediction.type}</Text>
              </View>
              <View style={styles.probabilityBadge}>
                <Text style={styles.probabilityText}>
                  {Math.round(prediction.probability * 100)}%
                </Text>
              </View>
            </View>
            
            <View style={styles.predictionReason}>
              <Icon name="info-circle" size={12} color="#64748b" />
              <Text style={styles.predictionReasonText}>{prediction.reason}</Text>
            </View>
            
            <View style={styles.predictionTime}>
              <Icon name="clock" size={12} color="#10b981" />
              <Text style={styles.predictionTimeText}>建议时间: {prediction.suggestedTime}</Text>
            </View>

            <TouchableOpacity style={styles.predictionAction}>
              <Text style={styles.predictionActionText}>设置提醒</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 顶部Tab切换 */}
      <View style={styles.tabBar}>
        {[
          { id: 'timeline', label: '轨迹', icon: 'history' },
          { id: 'heatmap', label: '热力图', icon: 'fire' },
          { id: 'ai', label: 'AI预测', icon: 'brain' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Icon
              name={tab.icon}
              size={14}
              color={activeTab === tab.id ? '#fff' : '#94a3b8'}
            />
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 内容区域 */}
      <View style={styles.content}>
        {activeTab === 'timeline' && renderTimeline()}
        {activeTab === 'heatmap' && renderHeatmap()}
        {activeTab === 'ai' && renderAIPredictions()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  tabBar: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#94a3b8',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  timelineContainer: {
    flex: 1,
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterChipActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterChipText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  timelineScroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dateHeader: {
    marginTop: 16,
    marginBottom: 8,
  },
  dateHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 32,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(100, 116, 139, 0.3)',
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 12,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timelineTime: {
    fontSize: 12,
    color: '#64748b',
    marginRight: 8,
  },
  timelineBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  timelineBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  timelineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  timelineAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  timelineAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  timelineInfo: {
    flex: 1,
  },
  timelineName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  timelineLocation: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
  },
  timelineDetail: {
    fontSize: 11,
    color: '#64748b',
  },
  heatmapContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 20,
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center',
  },
  heatmapCell: {
    width: (width - 48) / 6,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heatmapHour: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  heatmapLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#64748b',
  },
  legendGradient: {
    flexDirection: 'row',
    gap: 2,
  },
  legendBox: {
    width: 20,
    height: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  insightCard: {
    marginTop: 24,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f59e0b',
  },
  insightText: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 20,
  },
  predictionsContainer: {
    flex: 1,
    padding: 16,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  aiSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
  },
  predictionCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  predictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  predictionAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  predictionAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  predictionInfo: {
    flex: 1,
  },
  predictionName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  predictionType: {
    fontSize: 12,
    color: '#94a3b8',
  },
  probabilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 12,
  },
  probabilityText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  predictionReason: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  predictionReasonText: {
    flex: 1,
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 18,
  },
  predictionTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  predictionTimeText: {
    fontSize: 12,
    color: '#10b981',
  },
  predictionAction: {
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  predictionActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
});

export default TimelineScreen;
