import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { formatLastContact, formatDistance } from '../utils/time';
import { makePhoneCall, navigateToLocation } from '../utils/communication';
import { useApp } from '../context/AppContext';

const ContactCard = ({ 
  contact, 
  onPress, 
  showLastContact = true,
  showDistance = true,
  showActions = true,
  compact = false,
}) => {
  const { defaultNavigation, updateContactLastContact } = useApp();
  
  const statusColor = {
    online: '#10b981',
    busy: '#f59e0b',
    offline: '#6b7280',
  }[contact.status] || '#6b7280';

  const handleCall = async () => {
    const result = await makePhoneCall(contact.phone);
    if (result.success) {
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
  const isRecent = contact.lastContact && (Date.now() - contact.lastContact < 24 * 60 * 60 * 1000);

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress}>
        <View style={styles.compactAvatarContainer}>
          {contact.avatar ? (
            <Image source={{ uri: contact.avatar }} style={styles.compactAvatar} />
          ) : (
            <View style={[styles.compactAvatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>{contact.name[0]}</Text>
            </View>
          )}
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        </View>
        <View style={styles.compactInfo}>
          <Text style={styles.compactName} numberOfLines={1}>{contact.name}</Text>
          <Text style={styles.compactPhone}>{contact.phone}</Text>
        </View>
        {showActions && (
          <TouchableOpacity style={styles.compactCallButton} onPress={handleCall}>
            <Icon name="phone" size={16} color="#3b82f6" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.avatarContainer}>
        {contact.avatar ? (
          <Image source={{ uri: contact.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>{contact.name[0]}</Text>
          </View>
        )}
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
        {showDistance && (
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>
              {formatDistance(contact.distance, contact.distanceUnit)}
            </Text>
          </View>
        )}
        
        {showActions && (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
              <Icon name="phone" size={14} color="#3b82f6" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleNavigate}>
              <Icon name="location-arrow" size={14} color="#10b981" />
            </TouchableOpacity>
          </View>
        )}
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
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  compactAvatarContainer: {
    position: 'relative',
    marginRight: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1e293b',
  },
  compactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e293b',
  },
  avatarPlaceholder: {
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
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
  compactInfo: {
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
  compactName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  compactPhone: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
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
  compactCallButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ContactCard;
