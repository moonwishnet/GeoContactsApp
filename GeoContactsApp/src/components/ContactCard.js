import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { formatLastContact } from '../utils/time';
import { makePhoneCall, navigateToLocation } from '../utils/communication';
import { useApp } from '../context/AppContext';

const ContactCard = ({ contact, onPress, showLastContact = true }) => {
  const { defaultNavigation, updateContactLastContact } = useApp();
  
  const statusColor = {
    online: '#10b981',
    busy: '#f59e0b',
    offline: '#6b7280',
  }[contact.status] || '#6b7280';

  const handleCall = async () => {
    const success = await makePhoneCall(contact.phone);
    if (success) {
      updateContactLastContact(contact.id);
    }
  };

  const handleNavigate = async () => {
    if (contact.latitude && contact.longitude) {
      await navigateToLocation(contact.latitude, contact.longitude, contact.name, defaultNavigation);
    }
  };

  const stars = '★'.repeat(contact.relationship) + '☆'.repeat(5 - contact.relationship);
  const lastContactText = formatLastContact(contact.lastContact);
  const isRecent = Date.now() - contact.lastContact < 24 * 60 * 60 * 1000;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: contact.avatar }} style={styles.avatar} />
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        {contact.isFavorite && (
          <View style={styles.favoriteBadge}>
            <Icon name="star" size={10} color="#fbbf24" />
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{contact.name}</Text>
          <Text style={styles.stars}>{stars}</Text>
        </View>
        
        <View style={styles.locationRow}>
          <Icon name="map-marker-alt" size={12} color="#3b82f6" />
          <Text style={styles.location} numberOfLines={1}>{contact.location}</Text>
          <Text style={styles.separator}>·</Text>
          <Text style={styles.context} numberOfLines={1}>{contact.context}</Text>
        </View>
        
        {showLastContact && (
          <Text style={[styles.lastContact, isRecent && styles.lastContactRecent]}>
            <Icon name="clock" size={10} /> {lastContactText}
          </Text>
        )}
      </View>
      
      <View style={styles.actionsContainer}>
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>{contact.distance}{contact.distanceUnit}</Text>
        </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Icon name="phone" size={14} color="#3b82f6" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleNavigate}>
            <Icon name="location-arrow" size={14} color="#10b981" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1e293b',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  favoriteBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  infoContainer: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginRight: 8,
  },
  stars: {
    fontSize: 12,
    color: '#fbbf24',
    letterSpacing: -1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: '#94a3b8',
    marginLeft: 4,
  },
  separator: {
    fontSize: 12,
    color: '#64748b',
    marginHorizontal: 4,
  },
  context: {
    fontSize: 12,
    color: '#60a5fa',
  },
  lastContact: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  lastContactRecent: {
    color: '#34d399',
  },
  actionsContainer: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  distanceBadge: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 6,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 6,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ContactCard;
