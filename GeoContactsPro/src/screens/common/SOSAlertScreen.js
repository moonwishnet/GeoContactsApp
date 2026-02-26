import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Vibration } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../../context/AppContext';
import { triggerSOS, sendSOSLocationUpdate } from '../../utils/communication';

const SOSAlertScreen = ({ navigation }) => {
  const { sosContacts } = useApp();
  const [countdown, setCountdown] = useState(5);
  const [isTriggered, setIsTriggered] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // 震动提醒
    Vibration.vibrate([500, 500, 500]);

    // 脉冲动画
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ).start();

    // 倒计时
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTriggerSOS();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isTriggered) {
      const timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        // 每30秒发送一次位置更新
        if (elapsedTime > 0 && elapsedTime % 30 === 0) {
          sendSOSLocationUpdate(sosContacts, { latitude: 39.9042, longitude: 116.4074, address: '当前位置' });
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isTriggered, elapsedTime]);

  const handleTriggerSOS = async () => {
    setIsTriggered(true);
    await triggerSOS(sosContacts, { latitude: 39.9042, longitude: 116.4074, address: '当前位置' });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {!isTriggered ? (
        <>
          <Animated.View style={[styles.sosIconContainer, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.sosIcon}>
              <Icon name="exclamation-triangle" size={60} color="#fff" />
            </View>
          </Animated.View>
          
          <Text style={styles.title}>SOS紧急求助</Text>
          <Text style={styles.subtitle}>将在 {countdown} 秒后自动触发</Text>
          
          <View style={styles.contactsContainer}>
            <Text style={styles.contactsTitle}>将通知以下联系人：</Text>
            {sosContacts.map((contact, index) => (
              <View key={index} style={styles.contactItem}>
                <Icon name="user" size={16} color="#94a3b8" />
                <Text style={styles.contactText}>{contact.name} ({contact.phone})</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>取消求助</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.activeIcon}>
            <Icon name="broadcast-tower" size={60} color="#ef4444" />
          </View>
          
          <Text style={styles.activeTitle}>SOS已触发</Text>
          <Text style={styles.activeSubtitle}>正在持续发送位置信息</Text>
          
          <View style={styles.timerContainer}>
            <Text style={styles.timerLabel}>已持续时间</Text>
            <Text style={styles.timerValue}>{formatTime(elapsedTime)}</Text>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Icon name="map-marker-alt" size={20} color="#3b82f6" />
              <Text style={styles.infoText}>位置已发送</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="phone" size={20} color="#10b981" />
              <Text style={styles.infoText}>正在拨打电话</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.stopButton} onPress={() => navigation.goBack()}>
            <Text style={styles.stopButtonText}>停止求助</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', padding: 20 },
  sosIconContainer: { marginBottom: 30 },
  sosIcon: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#ef4444', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#94a3b8', marginBottom: 40 },
  contactsContainer: { backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 16, padding: 20, width: '100%', marginBottom: 40 },
  contactsTitle: { fontSize: 14, color: '#94a3b8', marginBottom: 12 },
  contactItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  contactText: { fontSize: 14, color: '#fff' },
  cancelButton: { backgroundColor: 'rgba(100, 116, 139, 0.3)', paddingVertical: 16, paddingHorizontal: 40, borderRadius: 12 },
  cancelButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  activeIcon: { marginBottom: 30 },
  activeTitle: { fontSize: 28, fontWeight: 'bold', color: '#ef4444', marginBottom: 8 },
  activeSubtitle: { fontSize: 16, color: '#94a3b8', marginBottom: 40 },
  timerContainer: { alignItems: 'center', marginBottom: 40 },
  timerLabel: { fontSize: 14, color: '#94a3b8', marginBottom: 8 },
  timerValue: { fontSize: 48, fontWeight: 'bold', color: '#fff', fontVariant: ['tabular-nums'] },
  infoContainer: { flexDirection: 'row', gap: 20, marginBottom: 40 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(30, 41, 59, 0.7)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  infoText: { fontSize: 14, color: '#fff' },
  stopButton: { backgroundColor: '#ef4444', paddingVertical: 16, paddingHorizontal: 40, borderRadius: 12 },
  stopButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});

export default SOSAlertScreen;
