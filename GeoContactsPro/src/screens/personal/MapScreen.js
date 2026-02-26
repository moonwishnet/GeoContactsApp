import React, { useState, useEffect, useRef, useCallback } from 'react';
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
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../../context/AppContext';
import ContactCard from '../../components/ContactCard';
import { makePhoneCall, navigateToLocation, triggerSOS } from '../../utils/communication';
import { formatLastContact } from '../../utils/time';

const { width, height } = Dimensions.get('window');

const TABS = [
  { id: 'all', label: '全部' },
  { id: 'work', label: '工作' },
  { id: 'personal', label: '私人' },
  { id: 'nearby', label: '附近' },
];

const MapScreen = ({ navigation }) => {
  const { 
    contacts, 
    spatiotemporalTags,
    defaultNavigation, 
    updateContactLastContact, 
    sosContacts,
    settings,
  } = useApp();
  
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [sosModalVisible, setSosModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const mapRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // SOS按钮脉冲动画
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // 获取筛选后的联系人
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

    if (selectedTag) {
      filtered = filtered.filter(c => c.tags.includes(selectedTag.name));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (activeTab !== 'nearby') {
      filtered.sort((a, b) => (b.lastContact || 0) - (a.lastContact || 0));
    }

    return filtered;
  }, [contacts, activeTab, selectedTag, searchQuery]);

  const filteredContacts = getFilteredContacts();

  const handleCall = async (contact) => {
    const result = await makePhoneCall(contact.phone);
    if (result.success) updateContactLastContact(contact.id);
  };

  const handleNavigate = async (contact) => {
    if (contact.latitude && contact.longitude) {
      await navigateToLocation(contact.latitude, contact.longitude, contact.name, defaultNavigation);
    }
  };

  const handleSOS = async () => {
    setSosModalVisible(false);
    const result = await triggerSOS(sosContacts);
    if (result.success) {
      Alert.alert('SOS已触发', '已发送位置信息给紧急联系人');
      navigation.navigate('SOSAlert');
    }
  };

  const openContactModal = (contact) => {
    setSelectedContact(contact);
    setContactModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 39.9042,
          longitude: 116.4074,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {filteredContacts.map(contact => (
          <Marker
            key={contact.id}
            coordinate={{ latitude: contact.latitude, longitude: contact.longitude }}
            onPress={() => openContactModal(contact)}
          >
            <View style={styles.markerContainer}>
              <View style={[styles.markerBubble, contact.isFavorite && styles.markerBubbleFavorite]}>
                <Text style={styles.markerText}>{contact.name[0]}</Text>
              </View>
              <View style={styles.markerArrow} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* 搜索栏 */}
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

      {/* 维度切换Tab */}
      <View style={styles.tabContainer}>
        <View style={styles.tabBar}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => { setActiveTab(tab.id); setSelectedTag(null); }}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 标签滚动 */}
      <View style={styles.tagScrollContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagScroll}>
          <TouchableOpacity
            style={[styles.tagChip, !selectedTag && styles.tagChipActive]}
            onPress={() => setSelectedTag(null)}
          >
            <Text style={[styles.tagChipText, !selectedTag && styles.tagChipTextActive]}>全部</Text>
          </TouchableOpacity>
          {spatiotemporalTags.map(tag => (
            <TouchableOpacity
              key={tag.id}
              style={[styles.tagChip, selectedTag?.id === tag.id && styles.tagChipActive]}
              onPress={() => setSelectedTag(tag)}
            >
              <Icon name={tag.icon} size={12} color={selectedTag?.id === tag.id ? '#fff' : '#94a3b8'} />
              <Text style={[styles.tagChipText, selectedTag?.id === tag.id && styles.tagChipTextActive]}>
                {tag.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 底部联系人列表 */}
      <View style={styles.contactListContainer}>
        <View style={styles.contactListHeader}>
          <Text style={styles.contactListTitle}>
            {activeTab === 'nearby' ? '附近联系人' : '最近联系'}
          </Text>
          <Text style={styles.contactListCount}>{filteredContacts.length}人</Text>
        </View>
        <FlatList
          data={filteredContacts}
          renderItem={({ item }) => (
            <ContactCard contact={item} onPress={() => openContactModal(item)} showLastContact={activeTab !== 'nearby'} />
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contactList}
        />
      </View>

      {/* SOS按钮 */}
      <TouchableOpacity style={styles.sosButton} onPress={() => setSosModalVisible(true)}>
        <Animated.View style={[styles.sosPulse, { transform: [{ scale: pulseAnim }] }]} />
        <View style={styles.sosInner}>
          <Icon name="exclamation-triangle" size={20} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* 添加联系人按钮 */}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddContact')}>
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      {/* SOS弹窗 */}
      <Modal visible={sosModalVisible} transparent animationType="fade" onRequestClose={() => setSosModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.sosModal}>
            <View style={styles.sosModalHeader}>
              <Icon name="exclamation-triangle" size={40} color="#ef4444" />
              <Text style={styles.sosModalTitle}>紧急求助</Text>
            </View>
            <Text style={styles.sosModalText}>即将发送位置信息给紧急联系人并拨打电话</Text>
            <View style={styles.sosModalContacts}>
              {sosContacts.map((contact, index) => (
                <View key={index} style={styles.sosContactItem}>
                  <Text style={styles.sosContactName}>{contact.name}</Text>
                  <Text style={styles.sosContactPhone}>{contact.phone}</Text>
                </View>
              ))}
            </View>
            <View style={styles.sosModalButtons}>
              <TouchableOpacity style={styles.sosCancelButton} onPress={() => setSosModalVisible(false)}>
                <Text style={styles.sosCancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sosConfirmButton} onPress={handleSOS}>
                <Text style={styles.sosConfirmText}>立即求助</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 联系人详情弹窗 */}
      <Modal visible={contactModalVisible} transparent animationType="slide" onRequestClose={() => setContactModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.contactModal}>
            {selectedContact && (
              <>
                <View style={styles.contactModalHeader}>
                  <View style={styles.contactModalAvatar}>
                    <Text style={styles.contactModalAvatarText}>{selectedContact.name[0]}</Text>
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
                    <Text style={styles.contactModalInfoText}>{selectedContact.location}</Text>
                  </View>
                  <View style={styles.contactModalInfoItem}>
                    <Icon name="clock" size={16} color="#10b981" />
                    <Text style={styles.contactModalInfoText}>{formatLastContact(selectedContact.lastContact)}</Text>
                  </View>
                  <View style={styles.contactModalInfoItem}>
                    <Icon name="comment" size={16} color="#f59e0b" />
                    <Text style={styles.contactModalInfoText}>{selectedContact.context}</Text>
                  </View>
                </View>

                <View style={styles.contactModalActions}>
                  <TouchableOpacity style={[styles.contactModalAction, styles.callAction]} onPress={() => { handleCall(selectedContact); setContactModalVisible(false); }}>
                    <Icon name="phone" size={20} color="#fff" />
                    <Text style={styles.contactModalActionText}>打电话</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.contactModalAction, styles.navAction]} onPress={() => { handleNavigate(selectedContact); setContactModalVisible(false); }}>
                    <Icon name="location-arrow" size={20} color="#fff" />
                    <Text style={styles.contactModalActionText}>导航</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.contactModalClose} onPress={() => setContactModalVisible(false)}>
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
  container: { flex: 1, backgroundColor: '#0f172a' },
  map: { ...StyleSheet.absoluteFillObject },
  searchContainer: { position: 'absolute', top: 50, left: 16, right: 16, zIndex: 10 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#fff' },
  tabContainer: { position: 'absolute', top: 110, left: 16, right: 16, zIndex: 10 },
  tabBar: {
    flexDirection: 'row', backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 12, padding: 4, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: '#3b82f6' },
  tabText: { fontSize: 13, color: '#94a3b8', fontWeight: '500' },
  tabTextActive: { color: '#fff', fontWeight: '600' },
  tagScrollContainer: { position: 'absolute', top: 165, left: 0, right: 0, zIndex: 10 },
  tagScroll: { paddingHorizontal: 16, gap: 8 },
  tagChip: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: 'rgba(30, 41, 59, 0.95)', borderRadius: 20, borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', marginRight: 8, gap: 6,
  },
  tagChipActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  tagChipText: { fontSize: 12, color: '#94a3b8' },
  tagChipTextActive: { color: '#fff', fontWeight: '600' },
  contactListContainer: {
    position: 'absolute', bottom: 80, left: 16, right: 16, maxHeight: height * 0.35,
    backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden',
  },
  contactListHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  contactListTitle: { fontSize: 14, fontWeight: '600', color: '#fff' },
  contactListCount: { fontSize: 12, color: '#64748b' },
  contactList: { padding: 12 },
  markerContainer: { alignItems: 'center' },
  markerBubble: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#3b82f6',
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff',
  },
  markerBubbleFavorite: { backgroundColor: '#f59e0b' },
  markerText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  markerArrow: {
    width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8,
    borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#3b82f6',
    marginTop: -2,
  },
  sosButton: { position: 'absolute', bottom: 420, right: 16, width: 56, height: 56, justifyContent: 'center', alignItems: 'center' },
  sosPulse: { position: 'absolute', width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(239, 68, 68, 0.4)' },
  sosInner: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#ef4444',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#ef4444', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 5,
  },
  addButton: {
    position: 'absolute', bottom: 350, right: 16, width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  sosModal: {
    backgroundColor: '#1e293b', borderRadius: 20, padding: 24, width: '100%', maxWidth: 320,
    borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  sosModalHeader: { alignItems: 'center', marginBottom: 16 },
  sosModalTitle: { fontSize: 20, fontWeight: 'bold', color: '#ef4444', marginTop: 12 },
  sosModalText: { fontSize: 14, color: '#94a3b8', textAlign: 'center', marginBottom: 16 },
  sosModalContacts: { marginBottom: 20 },
  sosContactItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' },
  sosContactName: { fontSize: 14, color: '#fff' },
  sosContactPhone: { fontSize: 14, color: '#64748b' },
  sosModalButtons: { flexDirection: 'row', gap: 12 },
  sosCancelButton: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.1)', alignItems: 'center' },
  sosCancelText: { fontSize: 14, color: '#94a3b8', fontWeight: '600' },
  sosConfirmButton: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#ef4444', alignItems: 'center' },
  sosConfirmText: { fontSize: 14, color: '#fff', fontWeight: '600' },
  contactModal: {
    backgroundColor: '#1e293b', borderRadius: 20, padding: 24, width: '100%', maxWidth: 340,
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  contactModalHeader: { alignItems: 'center', marginBottom: 20 },
  contactModalAvatar: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: '#3b82f6',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  contactModalAvatarText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  contactModalName: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  contactModalPhone: { fontSize: 14, color: '#64748b', marginBottom: 12 },
  contactModalTags: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6 },
  contactModalTag: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: 'rgba(59, 130, 246, 0.2)', borderRadius: 12 },
  contactModalTagText: { fontSize: 11, color: '#3b82f6' },
  contactModalInfo: { marginBottom: 20 },
  contactModalInfoItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' },
  contactModalInfoText: { fontSize: 14, color: '#94a3b8', marginLeft: 12 },
  contactModalActions: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  contactModalAction: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, gap: 8 },
  callAction: { backgroundColor: '#3b82f6' },
  navAction: { backgroundColor: '#10b981' },
  contactModalActionText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  contactModalClose: { paddingVertical: 12, alignItems: 'center' },
  contactModalCloseText: { fontSize: 14, color: '#64748b' },
});

export default MapScreen;
