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
import MapView, { Polyline, Marker } from 'react-native-maps';
import { useApp } from '../../context/AppContext';

const { width } = Dimensions.get('window');

export default function TrajectoryAnalysisScreen() {
  const { contacts, subscription, getSubscriptionLimits } = useApp();
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [timeRange, setTimeRange] = useState('week'); // day, week, month

  const limits = getSubscriptionLimits();

  // 模拟轨迹数据
  const trajectoryData = {
    day: [
      { latitude: 39.9845, longitude: 116.3075, timestamp: Date.now() - 8 * 60 * 60 * 1000 },
      { latitude: 39.9855, longitude: 116.3085, timestamp: Date.now() - 6 * 60 * 60 * 1000 },
      { latitude: 39.9865, longitude: 116.3095, timestamp: Date.now() - 4 * 60 * 60 * 1000 },
      { latitude: 39.9875, longitude: 116.3105, timestamp: Date.now() - 2 * 60 * 60 * 1000 },
    ],
    week: [
      { latitude: 39.9845, longitude: 116.3075, timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000 },
      { latitude: 39.9855, longitude: 116.3085, timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000 },
      { latitude: 39.9865, longitude: 116.3095, timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000 },
      { latitude: 39.9875, longitude: 116.3105, timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000 },
    ],
    month: [
      { latitude: 39.9845, longitude: 116.3075, timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000 },
      { latitude: 39.9855, longitude: 116.3085, timestamp: Date.now() - 20 * 24 * 60 * 60 * 1000 },
      { latitude: 39.9865, longitude: 116.3095, timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000 },
      { latitude: 39.9875, longitude: 116.3105, timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000 },
    ],
  };

  const currentTrajectory = trajectoryData[timeRange];

  const stats = {
    totalDistance: '45.2',
    visitCount: 12,
    frequentLocation: '中关村软件园',
    activeDays: 18,
  };

  const frequentLocations = [
    { name: '中关村软件园', visits: 15, percentage: 40 },
    { name: '万达广场', visits: 8, percentage: 25 },
    { name: '家中', visits: 6, percentage: 20 },
    { name: '其他', visits: 4, percentage: 15 },
  ];

  if (!limits.trajectoryAnalysis) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>轨迹分析</Text>
        </View>
        <View style={styles.lockedContainer}>
          <Icon name="lock" size={64} color="#3b82f6" />
          <Text style={styles.lockedTitle}>高级功能</Text>
          <Text style={styles.lockedDesc}>
            轨迹分析是高级订阅专属功能，订阅后可查看联系人的出行规律和常用位置
          </Text>
          <TouchableOpacity style={styles.subscribeButton}>
            <Text style={styles.subscribeButtonText}>升级订阅</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>轨迹分析</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="share-alt" size={18} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* 联系人选择 */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.contactSelector}
        contentContainerStyle={styles.contactSelectorContent}
      >
        {contacts.map(contact => (
          <TouchableOpacity
            key={contact.id}
            style={[
              styles.contactChip,
              selectedContact?.id === contact.id && styles.contactChipActive
            ]}
            onPress={() => setSelectedContact(contact)}
          >
            <View style={styles.contactChipAvatar}>
              <Text style={styles.contactChipAvatarText}>{contact.name[0]}</Text>
            </View>
            <Text style={[
              styles.contactChipName,
              selectedContact?.id === contact.id && styles.contactChipNameActive
            ]}>
              {contact.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 时间范围选择 */}
      <View style={styles.timeRangeContainer}>
        {[
          { id: 'day', label: '今日' },
          { id: 'week', label: '本周' },
          { id: 'month', label: '本月' },
        ].map(range => (
          <TouchableOpacity
            key={range.id}
            style={[styles.timeRangeBtn, timeRange === range.id && styles.timeRangeBtnActive]}
            onPress={() => setTimeRange(range.id)}
          >
            <Text style={[
              styles.timeRangeBtnText,
              timeRange === range.id && styles.timeRangeBtnTextActive
            ]}>
              {range.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 地图 */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 39.985,
              longitude: 116.308,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            <Polyline
              coordinates={currentTrajectory}
              strokeColor="#3b82f6"
              strokeWidth={3}
            />
            {currentTrajectory.map((point, index) => (
              <Marker
                key={index}
                coordinate={point}
                title={`位置 ${index + 1}`}
              >
                <View style={[
                  styles.trajectoryPoint,
                  index === 0 && styles.startPoint,
                  index === currentTrajectory.length - 1 && styles.endPoint
                ]}>
                  <Text style={styles.trajectoryPointText}>{index + 1}</Text>
                </View>
              </Marker>
            ))}
          </MapView>
        </View>

        {/* 统计卡片 */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalDistance}</Text>
            <Text style={styles.statLabel}>总里程(km)</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.visitCount}</Text>
            <Text style={styles.statLabel}>访问地点</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.activeDays}</Text>
            <Text style={styles.statLabel}>活跃天数</Text>
          </View>
        </View>

        {/* 常去地点 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>常去地点</Text>
          <View style={styles.locationsCard}>
            {frequentLocations.map((location, index) => (
              <View key={index} style={styles.locationItem}>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={styles.locationVisits}>{location.visits}次</Text>
                </View>
                <View style={styles.locationBar}>
                  <View style={[styles.locationBarFill, { width: `${location.percentage}%` }]} />
                </View>
                <Text style={styles.locationPercentage}>{location.percentage}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 出行规律 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>出行规律</Text>
          <View style={styles.patternCard}>
            <View style={styles.patternItem}>
              <Icon name="sun" size={20} color="#f59e0b" />
              <View style={styles.patternInfo}>
                <Text style={styles.patternLabel}>早高峰出行</Text>
                <Text style={styles.patternValue}>08:00 - 09:00</Text>
              </View>
            </View>
            <View style={styles.patternDivider} />
            <View style={styles.patternItem}>
              <Icon name="moon" size={20} color="#8b5cf6" />
              <View style={styles.patternInfo}>
                <Text style={styles.patternLabel}>晚高峰出行</Text>
                <Text style={styles.patternValue}>18:00 - 19:00</Text>
              </View>
            </View>
            <View style={styles.patternDivider} />
            <View style={styles.patternItem}>
              <Icon name="calendar-week" size={20} color="#3b82f6" />
              <View style={styles.patternInfo}>
                <Text style={styles.patternLabel}>最活跃星期</Text>
                <Text style={styles.patternValue}>周二、周四</Text>
              </View>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  lockedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginTop: 16,
    marginBottom: 8,
  },
  lockedDesc: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  subscribeButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  contactSelector: {
    maxHeight: 70,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  contactSelectorContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  contactChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#334155',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  contactChipActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#3b82f620',
  },
  contactChipAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  contactChipAvatarText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contactChipName: {
    fontSize: 14,
    color: '#94a3b8',
  },
  contactChipNameActive: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  timeRangeBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    marginHorizontal: 4,
  },
  timeRangeBtnActive: {
    backgroundColor: '#3b82f6',
  },
  timeRangeBtnText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  timeRangeBtnTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
  trajectoryPoint: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  startPoint: {
    backgroundColor: '#10b981',
  },
  endPoint: {
    backgroundColor: '#ef4444',
  },
  trajectoryPointText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
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
    fontSize: 20,
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
  locationsCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
  },
  locationItem: {
    marginBottom: 16,
  },
  locationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  locationName: {
    fontSize: 14,
    color: '#f8fafc',
  },
  locationVisits: {
    fontSize: 14,
    color: '#94a3b8',
  },
  locationBar: {
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
    flex: 1,
  },
  locationBarFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
  locationPercentage: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  patternCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
  },
  patternItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  patternInfo: {
    marginLeft: 16,
    flex: 1,
  },
  patternLabel: {
    fontSize: 13,
    color: '#94a3b8',
  },
  patternValue: {
    fontSize: 15,
    color: '#f8fafc',
    fontWeight: '600',
    marginTop: 2,
  },
  patternDivider: {
    height: 1,
    backgroundColor: '#334155',
  },
});
