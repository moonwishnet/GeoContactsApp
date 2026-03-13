import React, { useState, useEffect, useContext, createContext } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const LOCATION_TASK = 'geocontacts-location-tracking';
const LocationShareContext = createContext();

// 平台特定的 TaskManager 导入
let TaskManager = null;
try {
  if (Platform.OS !== 'web') {
    TaskManager = require('expo-task-manager');
  }
} catch (e) {
  // Web 平台或导入失败时使用空实现
  TaskManager = {
    defineTask: () => {},
  };
}

export function LocationShareProvider({ children }) {
  const [isSharing, setIsSharing] = useState(false);
  const [sharedLocation, setSharedLocation] = useState(null);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const val = await AsyncStorage.getItem('locationShare');
      if (val) {
        const data = JSON.parse(val);
        setIsSharing(data.isSharing || false);
        setFriends(data.friends || []);
      }
    } catch (e) {}
  };

  const saveSettings = async (data) => {
    await AsyncStorage.setItem('locationShare', JSON.stringify(data));
  };

  const requestPermission = async () => {
    if (Platform.OS === 'web') {
      // Web 平台权限处理
      try {
        const fg = await Location.requestForegroundPermissionsAsync();
        return fg.status === 'granted';
      } catch (e) {
        return false;
      }
    }
    
    const fg = await Location.requestForegroundPermissionsAsync();
    if (fg.status !== 'granted') return false;
    const bg = await Location.requestBackgroundPermissionsAsync();
    return bg.status === 'granted';
  };

  const startSharing = async () => {
    if (Platform.OS === 'web') {
      // Web 平台不支持后台位置更新
      setIsSharing(true);
      await saveSettings({ isSharing: true, friends });
      return true;
    }

    const hasPermission = await requestPermission();
    if (!hasPermission) return false;

    try {
      await Location.startLocationUpdatesAsync(LOCATION_TASK, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 300000, // 5 minutes
        distanceInterval: 100,
        foregroundService: { notificationTitle: 'GeoContacts+', notificationBody: '位置共享中' },
      });

      setIsSharing(true);
      await saveSettings({ isSharing: true, friends });
      return true;
    } catch (e) {
      return false;
    }
  };

  const stopSharing = async () => {
    if (Platform.OS !== 'web') {
      try {
        const isRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK);
        if (isRunning) await Location.stopLocationUpdatesAsync(LOCATION_TASK);
      } catch (e) {}
    }
    setIsSharing(false);
    await saveSettings({ isSharing: false, friends });
  };

  const getCurrentLocation = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setSharedLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude, timestamp: loc.timestamp });
      return { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
    } catch (e) {
      return null;
    }
  };

  const addFriend = (friend) => {
    const updated = [...friends, friend];
    setFriends(updated);
    saveSettings({ isSharing, friends: updated });
  };

  const removeFriend = (friendId) => {
    const updated = friends.filter(f => f.id !== friendId);
    setFriends(updated);
    saveSettings({ isSharing, friends: updated });
  };

  return (
    <LocationShareContext.Provider value={{
      isSharing, sharedLocation, friends,
      startSharing, stopSharing, getCurrentLocation,
      addFriend, removeFriend, requestPermission,
    }}>
      {children}
    </LocationShareContext.Provider>
  );
}

export const useLocationShare = () => useContext(LocationShareContext);

// 定义后台任务（仅在非 Web 平台）
if (Platform.OS !== 'web' && TaskManager && TaskManager.defineTask) {
  TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
    if (error) return;
    if (data?.locations) {
      const loc = data.locations[0];
      // 存储最新位置用于分享
      try {
        await AsyncStorage.setItem('latestLocation', JSON.stringify({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          timestamp: loc.timestamp,
        }));
      } catch (e) {}
    }
  });
}
