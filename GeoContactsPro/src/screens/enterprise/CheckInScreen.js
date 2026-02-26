import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../../context/AppContext';
import { calculateDistance } from '../../utils/time';

const CheckInScreen = () => {
  const { enterpriseData, addCheckInRecord } = useApp();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [checkInStatus, setCheckInStatus] = useState('none'); // none, in, out
  const [distance, setDistance] = useState(null);

  const settings = enterpriseData.checkInSettings;

  useEffect(() => {
    // 模拟获取当前位置
    setCurrentLocation({ latitude: 39.9845, longitude: 116.3075 });
  }, []);

  useEffect(() => {
    if (currentLocation && settings.location) {
      const dist = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        settings.location.latitude,
        settings.location.longitude
      );
      setDistance(dist);
    }
  }, [currentLocation, settings]);

  const handleCheckIn = (type) => {
    if (!settings.enabled) {
      Alert.alert('提示', '外勤打卡功能未开启');
      return;
    }

    if (distance > settings.radius / 1000) {
      Alert.alert('超出范围', `您距离打卡地点 ${(distance * 1000).toFixed(0)}米，超出允许范围 ${settings.radius}米`);
      return;
    }

    const record = {
      type,
      timestamp: Date.now(),
      location: currentLocation,
      distance: distance * 1000,
    };

    addCheckInRecord(record);
    setCheckInStatus(type === 'in' ? 'in' : 'out');
    Alert.alert('成功', type === 'in' ? '签到成功' : '签退成功');
  };

  const isInRange = distance !== null && distance <= settings.radius / 1000;

  return (
    <View style={styles.container}>
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusTitle}>今日打卡状态</Text>
          <View style={[styles.statusBadge, checkInStatus === 'in' ? styles.statusBadgeIn : checkInStatus === 'out' ? styles.statusBadgeOut : styles.statusBadgeNone]}>
            <Text style={styles.statusBadgeText}>
              {checkInStatus === 'none' ? '未打卡' : checkInStatus === 'in' ? '已签到' : '已签退'}
            </Text>
          </View>
        </View>
        
        <View style={styles.timeInfo}>
          <View style={styles.timeItem}>
            <Text style={styles.timeLabel}>上班时间</Text>
            <Text style={styles.timeValue}>{settings.startTime}</Text>
          </View>
          <View style={styles.timeDivider} />
          <View style={styles.timeItem}>
            <Text style={styles.timeLabel}>下班时间</Text>
            <Text style={styles.timeValue}>{settings.endTime}</Text>
          </View>
        </View>
      </View>

      <View style={styles.locationCard}>
        <View style={styles.locationHeader}>
          <Icon name="map-marker-alt" size={20} color="#3b82f6" />
          <Text style={styles.locationTitle}>打卡地点</Text>
        </View>
        <Text style={styles.locationAddress}>{settings.location.address}</Text>
        <Text style={styles.locationRadius}>打卡范围：{settings.radius}米</Text>
        {distance !== null && (
          <View style={[styles.distanceBadge, isInRange ? styles.distanceBadgeIn : styles.distanceBadgeOut]}>
            <Text style={styles.distanceText}>
              距离 {(distance * 1000).toFixed(0)} 米 · {isInRange ? '在范围内' : '超出范围'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.checkButton, styles.checkInButton, checkInStatus !== 'none' && styles.checkButtonDisabled]}
          onPress={() => handleCheckIn('in')}
          disabled={checkInStatus !== 'none'}
        >
          <Icon name="sign-in-alt" size={24} color="#fff" />
          <Text style={styles.checkButtonText}>签到</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.checkButton, styles.checkOutButton, checkInStatus !== 'in' && styles.checkButtonDisabled]}
          onPress={() => handleCheckIn('out')}
          disabled={checkInStatus !== 'in'}
        >
          <Icon name="sign-out-alt" size={24} color="#fff" />
          <Text style={styles.checkButtonText}>签退</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  statusCard: { backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  statusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  statusTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusBadgeNone: { backgroundColor: 'rgba(100, 116, 139, 0.3)' },
  statusBadgeIn: { backgroundColor: 'rgba(16, 185, 129, 0.3)' },
  statusBadgeOut: { backgroundColor: 'rgba(59, 130, 246, 0.3)' },
  statusBadgeText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  timeInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  timeItem: { alignItems: 'center' },
  timeLabel: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  timeValue: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  timeDivider: { width: 1, height: 40, backgroundColor: 'rgba(255, 255, 255, 0.1)' },
  locationCard: { backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  locationHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  locationTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginLeft: 8 },
  locationAddress: { fontSize: 14, color: '#94a3b8', marginBottom: 8 },
  locationRadius: { fontSize: 12, color: '#64748b' },
  distanceBadge: { marginTop: 12, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignSelf: 'flex-start' },
  distanceBadgeIn: { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
  distanceBadgeOut: { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
  distanceText: { fontSize: 13, fontWeight: '500' },
  buttonContainer: { flexDirection: 'row', gap: 16, marginTop: 'auto' },
  checkButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, gap: 8 },
  checkInButton: { backgroundColor: '#10b981' },
  checkOutButton: { backgroundColor: '#3b82f6' },
  checkButtonDisabled: { backgroundColor: 'rgba(100, 116, 139, 0.5)' },
  checkButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});

export default CheckInScreen;
