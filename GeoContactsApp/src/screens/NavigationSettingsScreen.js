import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp, NAVIGATION_APPS } from '../context/AppContext';
import { checkNavigationApp } from '../utils/communication';

const NavigationSettingsScreen = () => {
  const { defaultNavigation, saveDefaultNavigation } = useApp();
  const [installedApps, setInstalledApps] = useState({});
  const [selectedApp, setSelectedApp] = useState(defaultNavigation);

  // 检查已安装的导航应用
  useEffect(() => {
    checkInstalledApps();
  }, []);

  const checkInstalledApps = async () => {
    const apps = ['amap', 'baidu', 'tencent', 'google'];
    const installed = {};
    
    for (const app of apps) {
      installed[app] = await checkNavigationApp(app);
    }
    
    setInstalledApps(installed);
  };

  // 保存设置
  const handleSave = async () => {
    await saveDefaultNavigation(selectedApp);
    Alert.alert('设置成功', `默认导航已设置为 ${NAVIGATION_APPS[selectedApp]?.name}`);
  };

  // 导航应用列表
  const navApps = [
    {
      id: 'amap',
      name: '高德地图',
      description: '国内领先的数字地图内容、导航和位置服务解决方案提供商',
      icon: 'map-marker-alt',
      color: '#3b82f6',
    },
    {
      id: 'baidu',
      name: '百度地图',
      description: '百度提供的网络地图搜索服务',
      icon: 'map-marker-alt',
      color: '#3b82f6',
    },
    {
      id: 'tencent',
      name: '腾讯地图',
      description: '腾讯提供的互联网地图服务',
      icon: 'map-marker-alt',
      color: '#3b82f6',
    },
    {
      id: 'google',
      name: 'Google地图',
      description: 'Google提供的地图服务',
      icon: 'map-marker-alt',
      color: '#10b981',
    },
    {
      id: 'system',
      name: '系统默认',
      description: '使用系统默认的地图应用',
      icon: 'map',
      color: '#64748b',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          选择您偏好的导航应用，当点击导航按钮时将自动使用该应用打开路线规划。
        </Text>

        <View style={styles.appsContainer}>
          {navApps.map((app) => {
            const isInstalled = installedApps[app.id];
            const isSelected = selectedApp === app.id;
            const isSystem = app.id === 'system';

            return (
              <TouchableOpacity
                key={app.id}
                style={[
                  styles.appCard,
                  isSelected && styles.appCardSelected,
                  !isInstalled && !isSystem && styles.appCardDisabled,
                ]}
                onPress={() => {
                  if (isInstalled || isSystem) {
                    setSelectedApp(app.id);
                  } else {
                    Alert.alert(
                      '应用未安装',
                      `${app.name} 未安装，请先安装该应用或使用系统默认导航。`
                    );
                  }
                }}
                disabled={!isInstalled && !isSystem}
              >
                <View style={styles.appLeft}>
                  <View style={[styles.appIcon, { backgroundColor: app.color + '20' }]}>
                    <Icon name={app.icon} size={24} color={app.color} />
                  </View>
                  <View style={styles.appInfo}>
                    <View style={styles.appNameRow}>
                      <Text style={[
                        styles.appName,
                        !isInstalled && !isSystem && styles.appNameDisabled,
                      ]}>
                        {app.name}
                      </Text>
                      {!isInstalled && !isSystem && (
                        <View style={styles.notInstalledBadge}>
                          <Text style={styles.notInstalledText}>未安装</Text>
                        </View>
                      )}
                      {isInstalled && (
                        <View style={styles.installedBadge}>
                          <Text style={styles.installedText}>已安装</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.appDescription}>{app.description}</Text>
                  </View>
                </View>

                <View style={styles.radioContainer}>
                  <View style={[
                    styles.radioOuter,
                    isSelected && styles.radioOuterSelected,
                  ]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 使用说明 */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Icon name="lightbulb" size={16} color="#f59e0b" />
            <Text style={styles.tipsTitle}>使用提示</Text>
          </View>
          <Text style={styles.tipsText}>
            1. 选择的导航应用需要先在手机上安装才能正常使用{'\n'}
            2. 如果选择的应用未安装，系统会自动尝试使用其他已安装的导航应用{'\n'}
            3. 系统默认选项会使用 Android 系统的 geo: 协议打开地图{'\n'}
            4. 导航功能需要开启位置权限
          </Text>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* 底部保存按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>保存设置</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 22,
    marginBottom: 20,
  },
  appsContainer: {
    gap: 12,
  },
  appCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  appCardSelected: {
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  appCardDisabled: {
    opacity: 0.6,
  },
  appLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  appInfo: {
    flex: 1,
  },
  appNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  appName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  appNameDisabled: {
    color: '#64748b',
  },
  notInstalledBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 4,
  },
  notInstalledText: {
    fontSize: 10,
    color: '#ef4444',
  },
  installedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 4,
  },
  installedText: {
    fontSize: 10,
    color: '#10b981',
  },
  appDescription: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
  radioContainer: {
    marginLeft: 12,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#3b82f6',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3b82f6',
  },
  tipsCard: {
    marginTop: 24,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f59e0b',
  },
  tipsText: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 22,
  },
  bottomSpace: {
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default NavigationSettingsScreen;
