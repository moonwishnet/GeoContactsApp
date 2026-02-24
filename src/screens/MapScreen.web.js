import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Animated,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import ContactCard from '../components/ContactCard';
import { makePhoneCall, navigateToLocation, triggerSOS } from '../utils/communication';
import { formatLastContact } from '../utils/time';

import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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
  const [userLocation, setUserLocation] = useState({ latitude: 39.9042, longitude: 116.4074 });
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

  const categoriesWithContacts = getCategoriesWithContacts();

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => console.log('Error getting location:', error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    }
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const isNearby = (contact) => {
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      contact.latitude,
      contact.longitude
    );
    return distance <= 5;
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.phone.includes(searchQuery);
    const matchesTab = activeTab === 'all' ||
                      (activeTab === 'work' && contact.categories?.some(c => c.dim === 'work')) ||
                      (activeTab === 'personal' && contact.categories?.some(c => c.dim === 'personal')) ||
                      (activeTab === 'nearby' && isNearby(contact));
    const matchesCategory = !selectedCategory || contact.categories?.some(c => c.nodeId === selectedCategory.id);
    return matchesSearch && matchesTab && matchesCategory;
  });

  const handleContactPress = (contact) => {
    setSelectedContact(contact);
    setContactModalVisible(true);
  };

  const handleCall = (contact) => {
    updateContactLastContact(contact.id);
    makePhoneCall(contact.phone);
  };

  const handleNavigate = (contact) => {
    navigateToLocation(contact.latitude, contact.longitude, contact.name, defaultNavigation);
  };

  const handleSOS = () => {
    triggerSOS(sosContacts, userLocation);
    setSosModalVisible(false);
  };

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    setSelectedCategory(null);
  };

  const handleCategoryPress = (cat) => {
    if (selectedCategory && selectedCategory.id === cat.id) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(cat);
    }
  };

  const renderMap = () => {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <MapContainer
          center={[userLocation.latitude, userLocation.longitude]}
          zoom={12}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
            <Popup>我的位置</Popup>
          </Marker>
          {filteredContacts.map(contact => (
            <Marker
              key={contact.id}
              position={[contact.latitude, contact.longitude]}
            >
              <Popup>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{contact.name}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{contact.phone}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>联系人地图</Text>
        <View style={styles.searchContainer}>
          <Icon name="search" size={16} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索联系人..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.tabContainer}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => handleTabPress(tab.id)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {(activeTab === 'work' || activeTab === 'personal') && categoriesWithContacts.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer} contentContainerStyle={styles.categoryScroll}>
          <TouchableOpacity
            style={[styles.categoryPill, !selectedCategory && styles.categoryPillSelected]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.categoryPillText, !selectedCategory && styles.categoryPillTextSelected]}>
              全部
            </Text>
          </TouchableOpacity>
          {categoriesWithContacts.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryPill, selectedCategory?.id === cat.id && styles.categoryPillSelected]}
              onPress={() => handleCategoryPress(cat)}
            >
              <Text style={[styles.categoryPillText, selectedCategory?.id === cat.id && styles.categoryPillTextSelected]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={styles.mapContainer}>
        {renderMap()}
      </View>

      <View style={styles.contactListContainer}>
        <Text style={styles.contactListTitle}>联系人 ({filteredContacts.length})</Text>
        <FlatList
          data={filteredContacts}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ContactCard
              contact={item}
              onPress={() => handleContactPress(item)}
              onCall={() => handleCall(item)}
              onNavigate={() => handleNavigate(item)}
            />
          )}
        />
      </View>

      <Animated.View style={[styles.sosButton, { transform: [{ scale: pulseAnim }]}]}>
        <TouchableOpacity
          style={styles.sosButtonInner}
          onPress={() => setSosModalVisible(true)}
        >
          <Icon name="ambulance" size={24} color="#fff" />
          <Text style={styles.sosButtonText}>SOS</Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal visible={contactModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedContact && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedContact.name}</Text>
                  <TouchableOpacity onPress={() => setContactModalVisible(false)}>
                    <Icon name="times" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                <View style={styles.modalBody}>
                  <Text style={styles.modalInfo}>{selectedContact.phone}</Text>
                  <Text style={styles.modalInfo}>{selectedContact.location}</Text>
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.modalButton} onPress={() => handleCall(selectedContact)}>
                    <Icon name="phone" size={20} color="#fff" />
                    <Text style={styles.modalButtonText}>打电话</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButton} onPress={() => handleNavigate(selectedContact)}>
                    <Icon name="directions" size={20} color="#fff" />
                    <Text style={styles.modalButtonText}>导航</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={sosModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.sosModalContent}>
            <Text style={styles.sosModalTitle}>紧急呼叫确认</Text>
            <Text style={styles.sosModalMessage}>
              将向 {sosContacts.length} 位紧急联系人发送位置并拨打电话
            </Text>
            <View style={styles.sosModalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setSosModalVisible(false)}>
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sosConfirmButton} onPress={handleSOS}>
                <Text style={styles.sosConfirmButtonText}>确认呼叫</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#667eea',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#667eea',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  categoryContainer: {
    padding: 12,
    maxHeight: 50,
  },
  categoryScroll: {
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  categoryPillSelected: {
    backgroundColor: '#667eea',
  },
  categoryPillText: {
    fontSize: 12,
    color: '#666',
  },
  categoryPillTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
  },
  contactListContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  contactListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  sosButton: {
    position: 'absolute',
    right: 20,
    bottom: 180,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  sosButtonInner: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  sosButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    marginBottom: 16,
  },
  modalInfo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#667eea',
    padding: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sosModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  sosModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 16,
  },
  sosModalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  sosModalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sosConfirmButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#e74c3c',
    alignItems: 'center',
  },
  sosConfirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MapScreen;
