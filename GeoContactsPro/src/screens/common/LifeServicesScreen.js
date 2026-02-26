import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../../context/AppContext';

export default function LifeServicesScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { lifeServices, setLifeServices } = useApp();

  const categories = [
    { id: 'all', label: '全部', icon: 'th-large' },
    { id: 'food', label: '餐饮', icon: 'utensils' },
    { id: 'hotel', label: '酒店', icon: 'hotel' },
    { id: 'gas', label: '加油站', icon: 'gas-pump' },
    { id: 'shopping', label: '购物', icon: 'shopping-bag' },
    { id: 'entertainment', label: '娱乐', icon: 'film' },
  ];

  const services = [
    {
      id: 1,
      name: '海底捞火锅',
      category: 'food',
      rating: 4.8,
      distance: 0.5,
      address: '中关村大街1号',
      price: '人均¥120',
      isOpen: true,
      tags: ['火锅', '24小时'],
    },
    {
      id: 2,
      name: '如家快捷酒店',
      category: 'hotel',
      rating: 4.2,
      distance: 1.2,
      address: '中关村软件园路2号',
      price: '¥280/晚',
      isOpen: true,
      tags: ['经济型', '免费WiFi'],
    },
    {
      id: 3,
      name: '中石化加油站',
      category: 'gas',
      rating: 4.5,
      distance: 2.0,
      address: '北四环西路3号',
      price: '¥7.8/L',
      isOpen: true,
      tags: ['24小时', '便利店'],
    },
    {
      id: 4,
      name: '万达广场',
      category: 'shopping',
      rating: 4.6,
      distance: 1.5,
      address: '建国路4号',
      price: '',
      isOpen: true,
      tags: ['购物中心', '电影院'],
    },
    {
      id: 5,
      name: '星巴克咖啡',
      category: 'food',
      rating: 4.4,
      distance: 0.3,
      address: '软件园大厦1层',
      price: '人均¥35',
      isOpen: true,
      tags: ['咖啡', 'WiFi'],
    },
  ];

  const filteredServices = services.filter(service => {
    const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (serviceId) => {
    const favorites = lifeServices.favorites || [];
    const newFavorites = favorites.includes(serviceId)
      ? favorites.filter(id => id !== serviceId)
      : [...favorites, serviceId];
    setLifeServices({ ...lifeServices, favorites: newFavorites });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>周边服务</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="map-marked-alt" size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={16} color="#64748b" />
        <TextInput
          style={styles.searchInput}
          placeholder="搜索周边服务..."
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* 分类标签 */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              activeCategory === category.id && styles.categoryButtonActive
            ]}
            onPress={() => setActiveCategory(category.id)}
          >
            <Icon 
              name={category.icon} 
              size={14} 
              color={activeCategory === category.id ? '#fff' : '#94a3b8'} 
            />
            <Text style={[
              styles.categoryText,
              activeCategory === category.id && styles.categoryTextActive
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 筛选选项 */}
        <View style={styles.filterBar}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>距离</Text>
            <Icon name="sort-amount-down" size={12} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>评分</Text>
            <Icon name="sort-amount-down" size={12} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>价格</Text>
            <Icon name="sort-amount-down" size={12} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* 服务列表 */}
        <View style={styles.servicesList}>
          {filteredServices.map(service => (
            <TouchableOpacity key={service.id} style={styles.serviceCard}>
              <View style={styles.serviceHeader}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <View style={styles.serviceMeta}>
                    <View style={styles.ratingContainer}>
                      <Icon name="star" size={12} color="#f59e0b" />
                      <Text style={styles.ratingText}>{service.rating}</Text>
                    </View>
                    <Text style={styles.distanceText}>{service.distance}km</Text>
                    {service.isOpen && (
                      <View style={styles.openBadge}>
                        <Text style={styles.openText}>营业中</Text>
                      </View>
                    )}
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(service.id)}
                >
                  <Icon 
                    name="heart" 
                    size={18} 
                    color={(lifeServices.favorites || []).includes(service.id) ? '#ef4444' : '#64748b'}
                    solid={(lifeServices.favorites || []).includes(service.id)}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.serviceDetails}>
                <View style={styles.detailItem}>
                  <Icon name="map-marker-alt" size={12} color="#64748b" />
                  <Text style={styles.detailText}>{service.address}</Text>
                </View>
                {service.price && (
                  <View style={styles.detailItem}>
                    <Icon name="tag" size={12} color="#64748b" />
                    <Text style={styles.detailText}>{service.price}</Text>
                  </View>
                )}
              </View>

              <View style={styles.serviceTags}>
                {service.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.serviceActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="phone" size={14} color="#3b82f6" />
                  <Text style={styles.actionButtonText}>电话</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="directions" size={14} color="#3b82f6" />
                  <Text style={styles.actionButtonText}>导航</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="share-alt" size={14} color="#3b82f6" />
                  <Text style={styles.actionButtonText}>分享</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    margin: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    color: '#f8fafc',
    fontSize: 14,
  },
  categoryContainer: {
    maxHeight: 50,
    marginBottom: 12,
  },
  categoryContent: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  categoryText: {
    fontSize: 13,
    color: '#94a3b8',
    marginLeft: 6,
  },
  categoryTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
  },
  filterBar: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    marginRight: 8,
  },
  filterText: {
    fontSize: 13,
    color: '#94a3b8',
    marginRight: 4,
  },
  servicesList: {
    gap: 12,
  },
  serviceCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 6,
  },
  serviceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  ratingText: {
    fontSize: 13,
    color: '#f59e0b',
    marginLeft: 4,
  },
  distanceText: {
    fontSize: 13,
    color: '#64748b',
    marginRight: 12,
  },
  openBadge: {
    backgroundColor: '#10b98120',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  openText: {
    fontSize: 11,
    color: '#10b981',
  },
  favoriteButton: {
    padding: 8,
  },
  serviceDetails: {
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 13,
    color: '#94a3b8',
    marginLeft: 8,
  },
  serviceTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  serviceActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 13,
    color: '#3b82f6',
    marginLeft: 6,
  },
});
