import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../../context/AppContext';

const { width, height } = Dimensions.get('window');

export default function ARModeScreen({ navigation }) {
  const { contacts, subscription, getSubscriptionLimits } = useApp();
  const [arMode, setArMode] = useState('contacts'); // contacts | services
  const [brightness, setBrightness] = useState(80);
  const [zoom, setZoom] = useState(1);

  const limits = getSubscriptionLimits();

  useEffect(() => {
    if (!limits.arEnabled) {
      Alert.alert(
        '功能受限',
        'AR功能需要高级订阅才能使用',
        [
          { text: '取消', onPress: () => navigation.goBack() },
          { text: '去订阅', onPress: () => navigation.navigate('Subscription') },
        ]
      );
    }
  }, []);

  const nearbyContacts = contacts.slice(0, 3).map((contact, index) => ({
    ...contact,
    arX: width * 0.2 + index * width * 0.25,
    arY: height * 0.3 + (index % 2) * height * 0.15,
  }));

  const nearbyServices = [
    { id: 1, name: '星巴克', type: 'coffee', distance: 0.1, arX: width * 0.3, arY: height * 0.25 },
    { id: 2, name: '麦当劳', type: 'food', distance: 0.2, arX: width * 0.6, arY: height * 0.4 },
    { id: 3, name: '加油站', type: 'gas', distance: 0.5, arX: width * 0.2, arY: height * 0.5 },
  ];

  const renderAROverlay = () => {
    const items = arMode === 'contacts' ? nearbyContacts : nearbyServices;

    return (
      <View style={styles.arOverlay}>
        {limits.arEnabled && items.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.arMarker,
              {
                left: item.arX,
                top: item.arY,
                transform: [{ scale: zoom }],
              }
            ]}
          >
            <View style={[
              styles.markerIcon,
              arMode === 'contacts' ? styles.contactMarker : styles.serviceMarker
            ]}>
              <Icon 
                name={arMode === 'contacts' ? 'user' : 'store'} 
                size={16} 
                color="#fff" 
              />
            </View>
            <View style={styles.markerLabel}>
              <Text style={styles.markerName}>{item.name}</Text>
              <Text style={styles.markerDistance}>{item.distance}km</Text>
            </View>
            <View style={styles.markerLine} />
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* AR视图区域 */}
      <View style={styles.arContainer}>
        {/* 模拟摄像头视图 */}
        <View style={styles.cameraView}>
          <View style={styles.cameraPlaceholder}>
            <Icon name="camera" size={48} color="#334155" />
            <Text style={styles.cameraPlaceholderText}>AR摄像头视图</Text>
            <Text style={styles.cameraPlaceholderSubtext}>
              {limits.arEnabled 
                ? '将手机摄像头对准周围环境查看AR信息' 
                : '高级订阅功能'}
            </Text>
          </View>
          {renderAROverlay()}
        </View>

        {/* 顶部控制栏 */}
        <View style={styles.topControls}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="times" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.modeSwitch}>
            <TouchableOpacity
              style={[styles.modeBtn, arMode === 'contacts' && styles.modeBtnActive]}
              onPress={() => setArMode('contacts')}
            >
              <Text style={[styles.modeBtnText, arMode === 'contacts' && styles.modeBtnTextActive]}>
                联系人
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeBtn, arMode === 'services' && styles.modeBtnActive]}
              onPress={() => setArMode('services')}
            >
              <Text style={[styles.modeBtnText, arMode === 'services' && styles.modeBtnTextActive]}>
                周边服务
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.helpButton}>
            <Icon name="question-circle" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* 底部控制栏 */}
        <View style={styles.bottomControls}>
          <View style={styles.controlGroup}>
            <Text style={styles.controlLabel}>亮度</Text>
            <View style={styles.sliderContainer}>
              <TouchableOpacity 
                style={styles.sliderButton}
                onPress={() => setBrightness(Math.max(20, brightness - 10))}
              >
                <Icon name="minus" size={12} color="#fff" />
              </TouchableOpacity>
              <View style={styles.sliderTrack}>
                <View style={[styles.sliderFill, { width: `${brightness}%` }]} />
              </View>
              <TouchableOpacity 
                style={styles.sliderButton}
                onPress={() => setBrightness(Math.min(100, brightness + 10))}
              >
                <Icon name="plus" size={12} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.controlGroup}>
            <Text style={styles.controlLabel}>缩放</Text>
            <View style={styles.sliderContainer}>
              <TouchableOpacity 
                style={styles.sliderButton}
                onPress={() => setZoom(Math.max(0.5, zoom - 0.1))}
              >
                <Icon name="minus" size={12} color="#fff" />
              </TouchableOpacity>
              <View style={styles.sliderTrack}>
                <View style={[styles.sliderFill, { width: `${(zoom - 0.5) / 1.5 * 100}%` }]} />
              </View>
              <TouchableOpacity 
                style={styles.sliderButton}
                onPress={() => setZoom(Math.min(2, zoom + 0.1))}
              >
                <Icon name="plus" size={12} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionBtn}>
              <Icon name="location-arrow" size={20} color="#fff" />
              <Text style={styles.quickActionText}>导航</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionBtn}>
              <Icon name="search" size={20} color="#fff" />
              <Text style={styles.quickActionText}>搜索</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionBtn}>
              <Icon name="filter" size={20} color="#fff" />
              <Text style={styles.quickActionText}>筛选</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  arContainer: {
    flex: 1,
    position: 'relative',
  },
  cameraView: {
    flex: 1,
    position: 'relative',
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPlaceholderText: {
    fontSize: 18,
    color: '#94a3b8',
    marginTop: 16,
  },
  cameraPlaceholderSubtext: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
  },
  arOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  arMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  contactMarker: {
    backgroundColor: '#3b82f6',
  },
  serviceMarker: {
    backgroundColor: '#10b981',
  },
  markerLabel: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 4,
    alignItems: 'center',
  },
  markerName: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  markerDistance: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  markerLine: {
    width: 2,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeSwitch: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 4,
  },
  modeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  modeBtnActive: {
    backgroundColor: '#3b82f6',
  },
  modeBtnText: {
    fontSize: 14,
    color: '#fff',
  },
  modeBtnTextActive: {
    fontWeight: '600',
  },
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 16,
    paddingBottom: 30,
  },
  controlGroup: {
    marginBottom: 16,
  },
  controlLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
    marginHorizontal: 12,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  quickActionBtn: {
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
  },
});
