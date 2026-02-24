import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../context/AppContext';
import ContactCard from '../components/ContactCard';

const { width } = Dimensions.get('window');

const CategoryScreen = ({ navigation }) => {
  const { contacts, categoryDimensions } = useApp();
  const [activeDimension, setActiveDimension] = useState('work');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({});

  // 切换节点展开状态
  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  // 获取有联系人的分类
  const getCategoriesWithContacts = useCallback((dimension) => {
    const dim = categoryDimensions[dimension];
    if (!dim || !dim.tree) return [];

    const categories = [];
    const collectCategories = (nodes, level = 0) => {
      nodes.forEach(node => {
        const contactCount = contacts.filter(c =>
          c.categories.some(cat => cat.nodeId === node.id)
        ).length;
        
        if (contactCount > 0 || (node.children && node.children.length > 0)) {
          categories.push({ ...node, level, contactCount });
          if (node.children) {
            collectCategories(node.children, level + 1);
          }
        }
      });
    };
    collectCategories(dim.tree);
    return categories;
  }, [categoryDimensions, contacts]);

  // 获取筛选后的联系人
  const getFilteredContacts = useCallback(() => {
    let filtered = contacts.filter(c =>
      c.categories.some(cat => cat.dim === activeDimension)
    );

    if (selectedCategory) {
      filtered = filtered.filter(c =>
        c.categories.some(cat => cat.nodeId === selectedCategory.id)
      );
    }

    // 按最近联系排序
    filtered.sort((a, b) => b.lastContact - a.lastContact);
    return filtered;
  }, [contacts, activeDimension, selectedCategory]);

  // 渲染分类树节点
  const renderTreeNode = (node, level = 0) => {
    const isExpanded = expandedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedCategory?.id === node.id;
    const contactCount = contacts.filter(c =>
      c.categories.some(cat => cat.nodeId === node.id)
    ).length;

    if (contactCount === 0 && !hasChildren) return null;

    return (
      <View key={node.id}>
        <TouchableOpacity
          style={[
            styles.treeNode,
            { paddingLeft: 16 + level * 20 },
            isSelected && styles.treeNodeSelected,
          ]}
          onPress={() => setSelectedCategory(isSelected ? null : node)}
        >
          {hasChildren && (
            <TouchableOpacity
              style={styles.expandButton}
              onPress={() => toggleNode(node.id)}
            >
              <Icon
                name={isExpanded ? 'chevron-down' : 'chevron-right'}
                size={12}
                color="#64748b"
              />
            </TouchableOpacity>
          )}
          {!hasChildren && <View style={styles.expandPlaceholder} />}
          
          <View style={[styles.nodeDot, { backgroundColor: getNodeColor(node.color) }]} />
          <Text style={[styles.nodeText, isSelected && styles.nodeTextSelected]}>
            {node.name}
          </Text>
          <View style={styles.nodeBadge}>
            <Text style={styles.nodeBadgeText}>{contactCount}</Text>
          </View>
        </TouchableOpacity>
        
        {hasChildren && isExpanded && (
          <View>
            {node.children.map(child => renderTreeNode(child, level + 1))}
          </View>
        )}
      </View>
    );
  };

  // 获取节点颜色
  const getNodeColor = (color) => {
    const colorMap = {
      blue: '#3b82f6',
      purple: '#8b5cf6',
      orange: '#f97316',
      green: '#10b981',
      pink: '#ec4899',
      red: '#ef4444',
      slate: '#64748b',
    };
    return colorMap[color] || '#3b82f6';
  };

  const filteredContacts = getFilteredContacts();
  const categoriesWithContacts = getCategoriesWithContacts(activeDimension);

  return (
    <View style={styles.container}>
      {/* 顶部维度切换 */}
      <View style={styles.dimensionTabs}>
        <TouchableOpacity
          style={[
            styles.dimensionTab,
            activeDimension === 'work' && styles.dimensionTabActive,
          ]}
          onPress={() => {
            setActiveDimension('work');
            setSelectedCategory(null);
          }}
        >
          <Icon
            name="briefcase"
            size={16}
            color={activeDimension === 'work' ? '#fff' : '#94a3b8'}
          />
          <Text style={[
            styles.dimensionTabText,
            activeDimension === 'work' && styles.dimensionTabTextActive,
          ]}>工作</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.dimensionTab,
            activeDimension === 'personal' && styles.dimensionTabActive,
          ]}
          onPress={() => {
            setActiveDimension('personal');
            setSelectedCategory(null);
          }}
        >
          <Icon
            name="user-friends"
            size={16}
            color={activeDimension === 'personal' ? '#fff' : '#94a3b8'}
          />
          <Text style={[
            styles.dimensionTabText,
            activeDimension === 'personal' && styles.dimensionTabTextActive,
          ]}>私人</Text>
        </TouchableOpacity>
      </View>

      {/* 分类树 */}
      <View style={styles.treeContainer}>
        <View style={styles.treeHeader}>
          <Text style={styles.treeTitle}>分类筛选</Text>
          {selectedCategory && (
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Text style={styles.clearFilter}>清除筛选</Text>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView style={styles.treeScroll} showsVerticalScrollIndicator={false}>
          {categoryDimensions[activeDimension]?.tree.map(node => renderTreeNode(node))}
        </ScrollView>
      </View>

      {/* 联系人列表 */}
      <View style={styles.contactListContainer}>
        <View style={styles.contactListHeader}>
          <Text style={styles.contactListTitle}>
            {selectedCategory ? `${selectedCategory.name}的联系人` : '全部联系人'}
          </Text>
          <Text style={styles.contactListCount}>{filteredContacts.length}人</Text>
        </View>
        <FlatList
          data={filteredContacts}
          renderItem={({ item }) => (
            <ContactCard
              contact={item}
              onPress={() => navigation.navigate('ContactDetail', { contact: item })}
            />
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contactList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="users" size={48} color="#334155" />
              <Text style={styles.emptyText}>暂无联系人</Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  dimensionTabs: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  dimensionTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  dimensionTabActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  dimensionTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  dimensionTabTextActive: {
    color: '#fff',
  },
  treeContainer: {
    maxHeight: 200,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
  },
  treeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  treeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  clearFilter: {
    fontSize: 12,
    color: '#3b82f6',
  },
  treeScroll: {
    paddingVertical: 8,
  },
  treeNode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingRight: 16,
  },
  treeNodeSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  expandButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandPlaceholder: {
    width: 24,
  },
  nodeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  nodeText: {
    flex: 1,
    fontSize: 13,
    color: '#94a3b8',
  },
  nodeTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  nodeBadge: {
    minWidth: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(100, 116, 139, 0.3)',
    borderRadius: 10,
    alignItems: 'center',
  },
  nodeBadgeText: {
    fontSize: 11,
    color: '#64748b',
  },
  contactListContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  contactListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  contactListCount: {
    fontSize: 13,
    color: '#64748b',
  },
  contactList: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 12,
  },
});

export default CategoryScreen;
