import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../../context/AppContext';

export default function SocialScreen() {
  const [activeTab, setActiveTab] = useState('moments');
  const [newMoment, setNewMoment] = useState('');
  const { socialData, addMoment, settings, saveSettings } = useApp();

  const tabs = [
    { id: 'moments', label: '时空动态', icon: 'stream' },
    { id: 'friends', label: '好友', icon: 'user-friends' },
    { id: 'nearby', label: '附近', icon: 'map-marker-alt' },
  ];

  const moments = socialData.moments.length > 0 ? socialData.moments : [
    {
      id: 1,
      author: '张三',
      avatar: null,
      content: '今天在中关村软件园开会，附近的可以一起喝杯咖啡！',
      location: '中关村软件园',
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      likes: 5,
      comments: 2,
      images: [],
    },
    {
      id: 2,
      author: '李四',
      avatar: null,
      content: '周末约羽毛球，有人一起吗？',
      location: '奥体中心',
      timestamp: Date.now() - 5 * 60 * 60 * 1000,
      likes: 8,
      comments: 4,
      images: [],
    },
  ];

  const friends = [
    { id: 1, name: '张三', status: 'online', lastLocation: '中关村软件园', distance: 0.8 },
    { id: 2, name: '李四', status: 'offline', lastLocation: '家中', distance: 2.5 },
    { id: 3, name: '王五', status: 'online', lastLocation: '万达广场', distance: 0.5 },
  ];

  const nearbyStrangers = [
    { id: 1, nickname: '咖啡爱好者', distance: 0.1, location: '星巴克' },
    { id: 2, nickname: '运动达人', distance: 0.3, location: '健身房' },
    { id: 3, nickname: '书友', distance: 0.5, location: '图书馆' },
  ];

  const handlePostMoment = () => {
    if (newMoment.trim()) {
      addMoment({
        id: Date.now(),
        author: '我',
        content: newMoment,
        location: '当前位置',
        timestamp: Date.now(),
        likes: 0,
        comments: 0,
      });
      setNewMoment('');
    }
  };

  const formatTime = (timestamp) => {
    const diff = Date.now() - timestamp;
    if (diff < 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 1000))}分钟前`;
    } else if (diff < 24 * 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 60 * 1000))}小时前`;
    } else {
      return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`;
    }
  };

  const renderMoments = () => (
    <>
      {/* 发布动态 */}
      <View style={styles.postCard}>
        <TextInput
          style={styles.postInput}
          placeholder="分享你的时空动态..."
          placeholderTextColor="#64748b"
          value={newMoment}
          onChangeText={setNewMoment}
          multiline
        />
        <View style={styles.postActions}>
          <View style={styles.postOptions}>
            <TouchableOpacity style={styles.postOption}>
              <Icon name="image" size={18} color="#3b82f6" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.postOption}>
              <Icon name="map-marker-alt" size={18} color="#3b82f6" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.postOption}>
              <Icon name="eye" size={18} color="#3b82f6" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.postButton} onPress={handlePostMoment}>
            <Text style={styles.postButtonText}>发布</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 动态列表 */}
      <View style={styles.momentsList}>
        {moments.map(moment => (
          <View key={moment.id} style={styles.momentCard}>
            <View style={styles.momentHeader}>
              <View style={styles.momentAvatar}>
                <Text style={styles.momentAvatarText}>{moment.author[0]}</Text>
              </View>
              <View style={styles.momentInfo}>
                <Text style={styles.momentAuthor}>{moment.author}</Text>
                <View style={styles.momentMeta}>
                  <Text style={styles.momentTime}>{formatTime(moment.timestamp)}</Text>
                  <Icon name="map-marker-alt" size={10} color="#64748b" style={{ marginHorizontal: 4 }} />
                  <Text style={styles.momentLocation}>{moment.location}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.momentContent}>{moment.content}</Text>
            <View style={styles.momentActions}>
              <TouchableOpacity style={styles.momentAction}>
                <Icon name="heart" size={14} color="#64748b" />
                <Text style={styles.momentActionText}>{moment.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.momentAction}>
                <Icon name="comment" size={14} color="#64748b" />
                <Text style={styles.momentActionText}>{moment.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.momentAction}>
                <Icon name="share" size={14} color="#64748b" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </>
  );

  const renderFriends = () => (
    <View style={styles.friendsList}>
      {friends.map(friend => (
        <View key={friend.id} style={styles.friendCard}>
          <View style={styles.friendAvatar}>
            <Text style={styles.friendAvatarText}>{friend.name[0]}</Text>
            <View style={[
              styles.friendStatus,
              { backgroundColor: friend.status === 'online' ? '#10b981' : '#64748b' }
            ]} />
          </View>
          <View style={styles.friendInfo}>
            <Text style={styles.friendName}>{friend.name}</Text>
            <View style={styles.friendMeta}>
              <Icon name="map-marker-alt" size={10} color="#64748b" />
              <Text style={styles.friendLocation}>{friend.lastLocation}</Text>
              <Text style={styles.friendDistance}>· {friend.distance}km</Text>
            </View>
          </View>
          <View style={styles.friendActions}>
            <TouchableOpacity style={styles.friendActionBtn}>
              <Icon name="comment" size={16} color="#3b82f6" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.friendActionBtn}>
              <Icon name="phone" size={16} color="#3b82f6" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderNearby = () => (
    <>
      {!settings.socialEnabled ? (
        <View style={styles.enableSocialCard}>
          <Icon name="user-shield" size={48} color="#3b82f6" />
          <Text style={styles.enableSocialTitle}>附近的人</Text>
          <Text style={styles.enableSocialDesc}>
            开启此功能可以查看附近的其他用户，进行轻量社交互动
          </Text>
          <TouchableOpacity 
            style={styles.enableSocialButton}
            onPress={() => saveSettings({ ...settings, socialEnabled: true })}
          >
            <Text style={styles.enableSocialButtonText}>开启功能</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.nearbyList}>
          <View style={styles.nearbyNotice}>
            <Icon name="info-circle" size={14} color="#f59e0b" />
            <Text style={styles.nearbyNoticeText}>
              仅显示昵称和距离，保护隐私安全
            </Text>
          </View>
          {nearbyStrangers.map(person => (
            <View key={person.id} style={styles.nearbyCard}>
              <View style={styles.nearbyAvatar}>
                <Icon name="user" size={20} color="#64748b" />
              </View>
              <View style={styles.nearbyInfo}>
                <Text style={styles.nearbyNickname}>{person.nickname}</Text>
                <View style={styles.nearbyMeta}>
                  <Icon name="map-marker-alt" size={10} color="#64748b" />
                  <Text style={styles.nearbyLocation}>{person.location}</Text>
                  <Text style={styles.nearbyDistance}>· {person.distance * 1000}m</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.nearbyActionBtn}>
                <Text style={styles.nearbyActionText}>打招呼</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>时空社交</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="user-plus" size={18} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Icon name={tab.icon} size={14} color={activeTab === tab.id ? '#fff' : '#94a3b8'} />
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'moments' && renderMoments()}
        {activeTab === 'friends' && renderFriends()}
        {activeTab === 'nearby' && renderNearby()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    color: '#94a3b8',
    marginLeft: 6,
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  postCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  postInput: {
    minHeight: 80,
    color: '#f8fafc',
    fontSize: 15,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postOptions: {
    flexDirection: 'row',
  },
  postOption: {
    padding: 8,
    marginRight: 8,
  },
  postButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  momentsList: {
    gap: 12,
  },
  momentCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  momentHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  momentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  momentAvatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  momentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  momentAuthor: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f8fafc',
  },
  momentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  momentTime: {
    fontSize: 12,
    color: '#64748b',
  },
  momentLocation: {
    fontSize: 12,
    color: '#64748b',
  },
  momentContent: {
    fontSize: 15,
    color: '#f8fafc',
    lineHeight: 22,
    marginBottom: 12,
  },
  momentActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 12,
  },
  momentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  momentActionText: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 4,
  },
  friendsList: {
    gap: 8,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
  },
  friendAvatar: {
    position: 'relative',
  },
  friendAvatarText: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b82f6',
    textAlign: 'center',
    lineHeight: 48,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  friendStatus: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#1e293b',
  },
  friendInfo: {
    flex: 1,
    marginLeft: 12,
  },
  friendName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f8fafc',
  },
  friendMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  friendLocation: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  friendDistance: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  friendActions: {
    flexDirection: 'row',
  },
  friendActionBtn: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: '#334155',
    borderRadius: 8,
  },
  enableSocialCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  enableSocialTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginTop: 16,
    marginBottom: 8,
  },
  enableSocialDesc: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  enableSocialButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  enableSocialButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  nearbyList: {
    gap: 8,
  },
  nearbyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  nearbyNoticeText: {
    fontSize: 13,
    color: '#f59e0b',
    marginLeft: 8,
  },
  nearbyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
  },
  nearbyAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nearbyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nearbyNickname: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f8fafc',
  },
  nearbyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  nearbyLocation: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  nearbyDistance: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  nearbyActionBtn: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  nearbyActionText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
});
