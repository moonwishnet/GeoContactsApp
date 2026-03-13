import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import config from '../config';

const WebMapComponent = ({ mapRegion, setMapRegion, userLocation, filteredContacts, openContactModal }) => {
  const mapRef = useRef(null);
  const [amapLoaded, setAmapLoaded] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const apiKey = config.amap.webApiKey;

  // 加载高德地图脚本
  useEffect(() => {
    if (Platform.OS === 'web' && apiKey) {
      loadAMapScript();
    }
  }, [apiKey]);

  // 当地图容器和 API 都准备好后初始化地图
  useEffect(() => {
    if (mapRef.current && window.AMap && amapLoaded && !mapInitialized) {
      initMap();
    }
  }, [amapLoaded, mapInitialized]);

  const loadAMapScript = () => {
    // 检查是否已经加载了高德地图 API
    if (window.AMap) {
      setAmapLoaded(true);
      return;
    }

    // 直接在页面中创建脚本元素，避免 CSP 限制
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${apiKey}`;
    script.onload = () => {
      setAmapLoaded(true);
    };
    script.onerror = () => {
      Alert.alert('错误', '高德地图 API 加载失败，请检查 API Key 是否正确');
    };
    document.head.appendChild(script);
  };

  const initMap = () => {
    try {
      if (!window.AMap) {
        console.error('AMap not loaded');
        return;
      }
      if (!mapRef.current) {
        console.error('mapRef.current is null');
        return;
      }

      // 初始化地图
      const map = new window.AMap.Map(mapRef.current, {
        zoom: 15,
        center: [mapRegion.longitude, mapRegion.latitude],
        resizeEnable: true
      });

      // 添加用户位置标记
      if (userLocation) {
        try {
          // 添加用户位置圆圈
          new window.AMap.Circle({
            center: [userLocation.longitude, userLocation.latitude],
            radius: 500,
            fillColor: 'rgba(59, 130, 246, 0.1)',
            strokeColor: 'rgba(59, 130, 246, 0.3)',
            strokeWeight: 2
          }).setMap(map);

          // 添加用户位置标记
          new window.AMap.Marker({
            position: [userLocation.longitude, userLocation.latitude],
            title: '我的位置'
          }).setMap(map);
        } catch (err) {
          console.error('添加用户位置标记失败:', err);
        }
      }

      // 添加联系人标记
      if (filteredContacts && Array.isArray(filteredContacts)) {
        filteredContacts.forEach(contact => {
          try {
            if (contact.latitude && contact.longitude) {
              // 创建自定义标记内容
              const markerContent = document.createElement('div');
              markerContent.style.cssText = `
                background-color: ${contact.isFavorite ? '#fbbf24' : '#3b82f6'};
                color: white;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                text-align: center;
                line-height: 36px;
                font-weight: bold;
                font-size: 16px;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                cursor: pointer;
              `;
              markerContent.textContent = contact.name[0];

              // 创建标记
              const marker = new window.AMap.Marker({
                position: [contact.longitude, contact.latitude],
                title: contact.name,
                content: markerContent
              });

              // 添加点击事件
              marker.on('click', () => {
                if (openContactModal) {
                  openContactModal(contact);
                }
              });

              marker.setMap(map);
            }
          } catch (err) {
            console.error('添加联系人标记失败:', contact.name, err);
          }
        });
      }

      // 添加地图移动结束事件
      try {
        map.on('moveend', () => {
          const center = map.getCenter();
          setMapRegion({
            latitude: center.lat,
            longitude: center.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          });
        });
      } catch (err) {
        console.error('添加地图事件监听失败:', err);
      }

      setMapInitialized(true);
    } catch (err) {
      console.error('初始化地图失败:', err);
      Alert.alert('错误', '地图初始化失败：' + err.message);
    }
  };

  return (
    <View style={styles.map}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    backgroundColor: '#1e293b'
  },
  inputContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 12
  },
  input: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.5)'
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default WebMapComponent;
