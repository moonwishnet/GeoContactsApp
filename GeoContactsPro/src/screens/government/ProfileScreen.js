import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../../context/AppContext';

export default function GovernmentProfileScreen({ navigation }) {
  const { governmentData, saveAppMode } = useApp();

  const handleSwitchMode = () => {
    Alert.alert(
      '切换模式',
      '请选择要切换的模式',
      [
        { text: '个人版', onPress: () => saveAppMode('personal') },
        { text: '企业版', onPress: () => saveAppMode('enterprise') },
        { text: '取消', style: 'cancel' },
      ]
    );
  };

  const menuItems = [
    {
      title: '系统设置',
      items: [
        { icon: 'bell', label: '消息通知', value: '已开启' },
        { icon: 'map-marked', label: '地图设置', value: '' },
        { icon: 'shield-alt', label: '隐私安全', value: '' },
        { icon: 'database', label: '数据管理', value: '' },
      ],
    },
    {
      title: '监管设置',
      items: [
        { icon: 'eye', label: '监管参数', value: '' },
        { icon: 'exclamation-triangle', label: '预警规则', value: '' },
        { icon: 'map', label: '管控区域', value: `${governmentData.controlZones.length}个` },
        { icon: 'clock', label: '刷新频率', value: '30秒' },
      ],
    },
    {
      title: '报表设置',
      items: [
        { icon: 'file-alt', label: '报表模板', value: '' },
        { icon: 'calendar', label: '定时生成', value: '已开启' },
        { icon: 'envelope', label: '推送设置', value: '' },
      ],
    },
    {
      title: '其他',
      items: [
        { icon: 'question-circle', label: '帮助中心', value: '' },
        { icon: 'info-circle', label: '关于我们', value: 'V2.0.0' },
        { icon: 'exchange-alt', label: '切换模式', value: '', onPress: handleSwitchMode },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>我的</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="cog" size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 用户信息卡片 */}
        <View style={styles.userCard}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>管</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>管理员</Text>
            <Text style={styles.userRole}>超级管理员</Text>
            <Text style={styles.userOrg}>{governmentData.organizationName}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Icon name="edit" size={16} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        {/* 权限信息 */}
        <View style={styles.permissionCard}>
          <View style={styles.permissionItem}>
            <Icon name="user-shield" size={20} color="#3b82f6" />
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionTitle}>权限级别</Text>
              <Text style={styles.permissionValue}>超级管理员</Text>
            </View>
          </View>
          <View style={styles.permissionDivider} />
          <View style={styles.permissionItem}>
            <Icon name="folder-open" size={20} color="#10b981" />
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionTitle}>数据访问</Text>
              <Text style={styles.permissionValue}>全部数据</Text>
            </View>
          </View>
        </View>

        {/* 菜单列表 */}
        {menuItems.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{section.title}</Text>
            <View style={styles.menuItems}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.menuItem,
                    itemIndex === section.items.length - 1 && styles.menuItemLast
                  ]}
                  onPress={item.onPress}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuIcon}>
                      <Icon name={item.icon} size={18} color="#3b82f6" />
                    </View>
                    <Text style={styles.menuItemLabel}>{item.label}</Text>
                  </View>
                  <View style={styles.menuItemRight}>
                    {item.value ? (
                      <Text style={styles.menuItemValue}>{item.value}</Text>
                    ) : null}
                    <Icon name="chevron-right" size={14} color="#64748b" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* 版本信息 */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>GeoContacts⁺ Pro 政企版 V2.0.0</Text>
          <Text style={styles.copyright}>© 2024 GeoContacts⁺ Pro</Text>
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
  content: {
    flex: 1,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  userAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  userRole: {
    fontSize: 14,
    color: '#3b82f6',
    marginTop: 4,
  },
  userOrg: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  permissionCard: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
  },
  permissionItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  permissionDivider: {
    width: 1,
    backgroundColor: '#334155',
    marginHorizontal: 16,
  },
  permissionInfo: {
    marginLeft: 12,
  },
  permissionTitle: {
    fontSize: 12,
    color: '#64748b',
  },
  permissionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f8fafc',
    marginTop: 2,
  },
  menuSection: {
    marginBottom: 20,
  },
  menuSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginLeft: 16,
    marginBottom: 8,
  },
  menuItems: {
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    borderRadius: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemLabel: {
    fontSize: 15,
    color: '#f8fafc',
    marginLeft: 12,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 8,
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 14,
    color: '#64748b',
  },
  copyright: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
  },
});
