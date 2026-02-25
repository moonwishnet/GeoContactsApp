import React, { useState, useCallback } from 'react';
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
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../context/AppContext';
import ContactCard from '../components/ContactCard';
import { makePhoneCall, navigateToLocation, triggerSOS } from '../utils/communication';
import { formatLastContact } from '../utils/time';

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
  const pulseAnim = useState(new Animated.Value(1))[0];

  React.useEffect(() => {
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

  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Icon name="users" size={48} color="#3b82f6" />
        <Text style={styles.mapPlaceholderText}>GeoContacts+</Text>
        <Text style={styles.mapPlaceholderSub}>
          {filteredContacts.length} 位联系人
        </Text>
      </View>

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

      {(activeTab === 'work' || activeTab === 'personal') && categoriesWithContacts.length > 0 && (
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

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddContact')}
      >
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>

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
                          {' '}({selectedContact.distance.toFixed(1)}km
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
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e293b',
  },
  mapPlaceholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
  mapPlaceholderSub: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
  },
  searchContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 10,
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
    fontSize: 14,
    color: '#fff',
  },
  tabContainer: {
    position: 'absolute',
    top: 110,
    left: 16,
    right: 16,
    zIndex: 10,
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
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#3b82f6',
  },
  tabText: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  categoryScrollContainer: {
    position: 'absolute',
    top: 165,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 20,
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
  contactListContainer: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    maxHeight: height * 0.35,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
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
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  contactListTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  contactListCount: {
    fontSize: 12,
    color: '#64748b',
  },
  contactList: {
    padding: 12,
  },
  sosButton: {
    position: 'absolute',
    bottom: 420,
    right: 16,
    width: 56,
    height: 56,
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
  addButton: {
    position: 'absolute',
    bottom: 350,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
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
    maxWidth: 320,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
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
    marginBottom: 16,
  },
  sosModalContacts: {
    marginBottom: 20,
  },
  sosContactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  sosContactName: {
    fontSize: 14,
    color: '#fff',
  },
  sosContactPhone: {
    fontSize: 12,
    color: '#64748b',
  },
  sosModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  sosCancelButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#334155',
    borderRadius: 12,
    alignItems: 'center',
  },
  sosCancelText: {
    color: '#94a3b8',
    fontWeight: '600',
  },
  sosConfirmButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    alignItems: 'center',
  },
  sosConfirmText: {
    color: '#fff',
    fontWeight: '600',
  },
  contactModal: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  contactModalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  contactModalAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactModalAvatarText: {
    fontSize: 28,
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
    gap: 8,
    justifyContent: 'center',
  },
  contactModalTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 12,
  },
  contactModalTagText: {
    fontSize: 12,
    color: '#3b82f6',
  },
  contactModalInfo: {
    marginBottom: 20,
    gap: 12,
  },
  contactModalInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contactModalInfoText: {
    fontSize: 14,
    color: '#cbd5e1',
    flex: 1,
  },
  contactModalDistance: {
    color: '#10b981',
    fontWeight: '500',
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
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  callAction: {
    backgroundColor: '#10b981',
  },
  navAction: {
    backgroundColor: '#3b82f6',
  },
  contactModalActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  contactModalClose: {
    paddingVertical: 14,
    backgroundColor: '#334155',
    borderRadius: 12,
    alignItems: 'center',
  },
  contactModalCloseText: {
    color: '#94a3b8',
    fontWeight: '600',
  },
});

export default MapScreen;
