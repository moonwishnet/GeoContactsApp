import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Modal,
  Animated,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Location from 'expo-location';
import { useApp } from '../context/AppContext';
import ContactCard from '../components/ContactCard';
import WebMapComponent from '../components/WebMapComponent';
import { makePhoneCall, navigateToLocation, triggerSOS } from '../utils/communication';
import { formatLastContact } from '../utils/time';
import config from '../config';

// 条件导入 MapView，Web 平台使用占位组件
let MapView, Marker, Circle, AMapSdk;
if (Platform.OS !== 'web') {
  // 移动端使用 react-native-maps
  const RNMaps = require('react-native-maps');
  MapView = RNMaps.MapView;
  Marker = RNMaps.Marker;
  Circle = RNMaps.Circle;
  AMapSdk = null; // react-native-maps 不需要 AMapSdk
} else {
  // Web 平台使用 WebMapComponent
  MapView = WebMapComponent;
  Marker = null; // Web 平台不需要单独的 Marker 组件
  Circle = null; // Web 平台不需要单独的 Circle 组件
  AMapSdk = null;
}

const { width, height } = Dimensions.get('window');

const TABS = [
  { id: 'all', label: '全部' },
  { id: 'work', label: '工作' },
  { id: 'personal', label: '私人' },
  { id: 'nearby', label: '附近' },
];

const MapScreen = ({ navigation }) => {
  const { contacts, categoryDimensions, defaultNavigation, updateContactLastContact, sosContacts } = useApp();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sosModalVisible, setSosModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 39.9042,
    longitude: 116.4074,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const pulseAnim = useState(new Animated.Value(1))[0];

  // 获取用户当前位置
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const { latitude, longitude } = location.coords;
        setUserLocation({ latitude, longitude });
        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    })();
  }, []);

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const getFilteredContacts = useCallback(() => {
    let filtered = [...contacts];

    if (activeTab === 'work') {
      filtered = filtered.filter(c => c.categories.some(cat => cat.dim === 'work'));
    } else if (activeTab === 'personal') {
      filtered = filtered.filter(c => c.categories.some(cat => cat.dim === 'personal'));
    } else if (activeTab === 'nearby') {
      filtered = filtered.filter(c => c.distance <= 5);
      filtered.sort((a, b) => a.distance - b.distance);
    }

    if (selectedCategory) {
      filtered = filtered.filter(c =>
        c.categories.some(cat => cat.nodeId === selectedCategory.id)
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (activeTab !== 'nearby') {
      filtered.sort((a, b) => b.lastContact - a.lastContact);
    }

    return filtered;
  }, [contacts, activeTab, selectedCategory, searchQuery]);

  const getCategoriesWithContacts = useCallback(() => {
    const dimKey = activeTab === 'work' ? 'work' : activeTab === 'personal' ? 'personal' : null;
    if (!dimKey) return [];

    const dim = categoryDimensions[dimKey];
    if (!dim || !dim.tree) return [];

    const categories = [];
    const collectCategories = (nodes) => {
      nodes.forEach(node => {
        const hasContacts = contacts.some(c =>
          c.categories.some(cat => cat.nodeId === node.id)
        );
        if (hasContacts) {
          categories.push(node);
        }
        if (node.children) {
          collectCategories(node.children);
        }
      });
    };
    collectCategories(dim.tree);
    return categories;
  }, [activeTab, categoryDimensions, contacts]);

  const filteredContacts = getFilteredContacts();
  const categoriesWithContacts = getCategoriesWithContacts();

  const handleCall = async (contact) => {
    const success = await makePhoneCall(contact.phone);
    if (success) {
      updateContactLastContact(contact.id);
    }
  };

  const handleNavigate = async (contact) => {
    if (contact.latitude && contact.longitude) {
      await navigateToLocation(contact.latitude, contact.longitude, contact.name, defaultNavigation);
    }
  };

  const handleSOS = async () => {
    setSosModalVisible(false);
    const success = await triggerSOS(sosContacts);
    if (success) {
      Alert.alert('SOS已触发', '已发送位置信息给紧急联系人');
    }
  };

  const openContactModal = (contact) => {
    setSelectedContact(contact);
    setContactModalVisible(true);
  };

  const renderContactItem = ({ item }) => (
    <ContactCard
      contact={item}
      onPress={() => openContactModal(item)}
      showLastContact={activeTab !== 'nearby'}
    />
  );

  // Web 平台地图组件
  const renderWebMap = () => (
    <WebMapComponent
      mapRegion={mapRegion}
      setMapRegion={setMapRegion}
      userLocation={userLocation}
      filteredContacts={filteredContacts}
      openContactModal={openContactModal}
    />
  );

  return (
    <View style={styles.container}>
      {/* 搜索框 */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={16} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索联系人..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="times-circle" size={16} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 标签栏 */}
      <View style={styles.tabContainer}>
        <View style={styles.tabBar}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => {
                setActiveTab(tab.id);
                setSelectedCategory(null);
              }}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.tabTextActive,
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 分类筛选 - 仅在 Web 平台显示 */}
      {(activeTab === 'work' || activeTab === 'personal') && categoriesWithContacts.length > 0 && Platform.OS === 'web' && (
        <View style={styles.categoryScrollContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            <TouchableOpacity
              style={[
                styles.categoryChip,
                !selectedCategory && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={[
                styles.categoryChipText,
                !selectedCategory && styles.categoryChipTextActive,
              ]}>全部</Text>
            </TouchableOpacity>
            {categoriesWithContacts.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  selectedCategory?.id === cat.id && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[
                  styles.categoryChipText,
                  selectedCategory?.id === cat.id && styles.categoryChipTextActive,
                ]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 地图区域 - 固定高度 */}
      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? renderWebMap() : (
          <MapView
            style={styles.map}
            zoomLevel={15}
            center={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }}
            onMapMoveEnd={(e) => {
              setMapRegion({
                latitude: e.latitude,
                longitude: e.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });
            }}
            showsUserLocation={true}
            showsLocationButton={false}
            showsCompass={true}
          >
            {/* 用户位置圆圈 */}
            {userLocation && (
              <Circle
                center={userLocation}
                radius={500}
                fillColor="rgba(59, 130, 246, 0.1)"
                strokeColor="rgba(59, 130, 246, 0.3)"
                strokeWidth={2}
              />
            )}
            
            {/* 联系人标记 */}
            {filteredContacts.map((contact) => (
              contact.latitude && contact.longitude && (
                <Marker
                  key={contact.id}
                  position={{ latitude: contact.latitude, longitude: contact.longitude }}
                  title={contact.name}
                  description={contact.location}
                  onPress={() => openContactModal(contact)}
                >
                  <View style={styles.markerContainer}>
                    <View style={[
                      styles.marker,
                      { backgroundColor: contact.isFavorite ? '#fbbf24' : '#3b82f6' }
                    ]}>
                      <Text style={styles.markerText}>{contact.name[0]}</Text>
                    </View>
                    <View style={styles.markerTriangle} />
                  </View>
                </Marker>
              )
            ))}
          </MapView>
        )}
        
        {/* 地图控制按钮 - 仅在非 Web 平台显示 */}
        {Platform.OS !== 'web' && (
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={() => {
              if (userLocation) {
                setMapRegion({
                  ...userLocation,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                });
              }
            }}
          >
            <Icon name="crosshairs" size={20} color="#3b82f6" />
          </TouchableOpacity>
        )}
        
        {/* 联系人数量指示器 - 仅在非 Web 平台显示 */}
        {Platform.OS !== 'web' && (
          <View style={styles.mapOverlay}>
            <Text style={styles.mapOverlayText}>{filteredContacts.length} 位联系人</Text>
          </View>
        )}
      </View>

      {/* 联系人列表 */}
      <View style={styles.contactListContainer}>
        <View style={styles.contactListHeader}>
          <Text style={styles.contactListTitle}>
            {activeTab === 'nearby' ? '附近联系人' : '最近联系'}
          </Text>
          <Text style={styles.contactListCount}>{filteredContacts.length}人</Text>
        </View>
        <FlatList
          data={filteredContacts}
          renderItem={renderContactItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contactList}
        />
      </View>

      {/* SOS 按钮 */}
      <TouchableOpacity
        style={styles.sosButton}
        onPress={() => setSosModalVisible(true)}
      >
        <Animated.View style={[
          styles.sosPulse,
          { transform: [{ scale: pulseAnim }] },
        ]} />
        <View style={styles.sosInner}>
          <Icon name="exclamation-triangle" size={20} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* 添加按钮 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddContact')}
      >
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      {/* SOS 弹窗 */}
      <Modal
        visible={sosModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSosModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sosModal}>
            <View style={styles.sosModalHeader}>
              <Icon name="exclamation-triangle" size={40} color="#ef4444" />
              <Text style={styles.sosModalTitle}>紧急求助</Text>
            </View>
            <Text style={styles.sosModalText}>
              即将发送位置信息给紧急联系人并拨打电话
            </Text>
            <View style={styles.sosModalContacts}>
              {sosContacts.map((contact, index) => (
                <View key={index} style={styles.sosContactItem}>
                  <Text style={styles.sosContactName}>{contact.name}</Text>
                  <Text style={styles.sosContactPhone}>{contact.phone}</Text>
                </View>
              ))}
            </View>
            <View style={styles.sosModalButtons}>
              <TouchableOpacity
                style={styles.sosCancelButton}
                onPress={() => setSosModalVisible(false)}
              >
                <Text style={styles.sosCancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sosConfirmButton}
                onPress={handleSOS}
              >
                <Text style={styles.sosConfirmText}>立即求助</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 联系人详情弹窗 */}
      <Modal
        visible={contactModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setContactModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.contactModal}>
            {selectedContact && (
              <>
                <View style={styles.contactModalHeader}>
                  <View style={styles.contactModalAvatar}>
                    <Text style={styles.contactModalAvatarText}>
                      {selectedContact.name[0]}
                    </Text>
                  </View>
                  <Text style={styles.contactModalName}>{selectedContact.name}</Text>
                  <Text style={styles.contactModalPhone}>{selectedContact.phone}</Text>
                  <View style={styles.contactModalTags}>
                    {selectedContact.tags.map((tag, index) => (
                      <View key={index} style={styles.contactModalTag}>
                        <Text style={styles.contactModalTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.contactModalInfo}>
                  <View style={styles.contactModalInfoItem}>
                    <Icon name="map-marker-alt" size={16} color="#3b82f6" />
                    <Text style={styles.contactModalInfoText}>
                      {selectedContact.location}
                      {selectedContact.distance !== null && (
                        <Text style={styles.contactModalDistance}>
                          {' '}({selectedContact.distance.toFixed(1)}km)
                        </Text>
                      )}
                    </Text>
                  </View>
                  <View style={styles.contactModalInfoItem}>
                    <Icon name="clock" size={16} color="#10b981" />
                    <Text style={styles.contactModalInfoText}>
                      {formatLastContact(selectedContact.lastContact)}
                    </Text>
                  </View>
                  <View style={styles.contactModalInfoItem}>
                    <Icon name="comment" size={16} color="#f59e0b" />
                    <Text style={styles.contactModalInfoText}>
                      {selectedContact.context}
                    </Text>
                  </View>
                </View>

                <View style={styles.contactModalActions}>
                  <TouchableOpacity
                    style={[styles.contactModalAction, styles.callAction]}
                    onPress={() => {
                      handleCall(selectedContact);
                      setContactModalVisible(false);
                    }}
                  >
                    <Icon name="phone" size={20} color="#fff" />
                    <Text style={styles.contactModalActionText}>打电话</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.contactModalAction, styles.navAction]}
                    onPress={() => {
                      handleNavigate(selectedContact);
                      setContactModalVisible(false);
                    }}
                  >
                    <Icon name="location-arrow" size={20} color="#fff" />
                    <Text style={styles.contactModalActionText}>导航</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.contactModalClose}
                  onPress={() => setContactModalVisible(false)}
                >
                  <Text style={styles.contactModalCloseText}>关闭</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  // 搜索框样式
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: '#0f172a',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#fff',
  },
  // 标签栏样式
  tabContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#0f172a',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  // 分类筛选样式
  categoryScrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#0f172a',
  },
  categoryScroll: {
    paddingRight: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  categoryChipText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  categoryChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  // 地图容器样式 - 固定高度
  mapContainer: {
    height: 300,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  markerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  markerTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#3b82f6',
    marginTop: -2,
  },
  locationButton: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  mapOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  mapOverlayText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  // 联系人列表样式
  contactListContainer: {
    flex: 1,
    marginHorizontal: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  contactListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  contactListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  contactListCount: {
    fontSize: 14,
    color: '#64748b',
  },
  contactList: {
    padding: 12,
  },
  // SOS 按钮样式
  sosButton: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosPulse: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(239, 68, 68, 0.4)',
  },
  sosInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  // 添加按钮样式
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  // 弹窗样式
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sosModal: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sosModalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  sosModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ef4444',
    marginTop: 12,
  },
  sosModalText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
  },
  sosModalContacts: {
    marginBottom: 20,
  },
  sosContactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sosContactName: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  sosContactPhone: {
    fontSize: 14,
    color: '#64748b',
  },
  sosModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  sosCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  sosCancelText: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '600',
  },
  sosConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    alignItems: 'center',
  },
  sosConfirmText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  contactModal: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  contactModalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  contactModalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactModalAvatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  contactModalName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  contactModalPhone: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  contactModalTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  contactModalTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  contactModalTagText: {
    fontSize: 12,
    color: '#3b82f6',
  },
  contactModalInfo: {
    marginBottom: 20,
  },
  contactModalInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  contactModalInfoText: {
    fontSize: 14,
    color: '#94a3b8',
    marginLeft: 12,
    flex: 1,
  },
  contactModalDistance: {
    color: '#3b82f6',
  },
  contactModalActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  contactModalAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  callAction: {
    backgroundColor: '#10b981',
  },
  navAction: {
    backgroundColor: '#3b82f6',
  },
  contactModalActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  contactModalClose: {
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  contactModalCloseText: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '600',
  },
});

export default MapScreen;
