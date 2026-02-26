import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../../context/AppContext';

export default function EnterpriseERPIntegrationScreen() {
  const { enterpriseData, updateEnterpriseData } = useApp();
  const [config, setConfig] = useState(enterpriseData.erpCrmConfig);
  const [isEditing, setIsEditing] = useState(false);

  const erpSystems = [
    { id: 'yonyou', name: '用友', icon: 'yonyou' },
    { id: 'kingdee', name: '金蝶', icon: 'kingdee' },
    { id: 'salesforce', name: 'Salesforce', icon: 'salesforce' },
    { id: 'custom', name: '自定义', icon: 'custom' },
  ];

  const syncFrequencies = [
    { id: 'realtime', name: '实时同步' },
    { id: 'hourly', name: '每小时' },
    { id: 'daily', name: '每天' },
    { id: 'manual', name: '手动同步' },
  ];

  const handleSave = () => {
    updateEnterpriseData({ erpCrmConfig: config });
    setIsEditing(false);
    Alert.alert('保存成功', 'ERP/CRM对接配置已更新');
  };

  const handleTestConnection = () => {
    Alert.alert('测试连接', '正在测试连接...', [
      { text: '确定', onPress: () => Alert.alert('连接成功', 'ERP/CRM系统连接正常') }
    ]);
  };

  const handleSync = () => {
    Alert.alert('数据同步', '确定要立即同步数据吗？', [
      { text: '取消', style: 'cancel' },
      { text: '同步', onPress: () => Alert.alert('同步完成', '数据同步成功') }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ERP/CRM对接</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          <Icon name={isEditing ? 'check' : 'edit'} size={18} color="#3b82f6" />
          <Text style={styles.editButtonText}>{isEditing ? '保存' : '编辑'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 连接状态 */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusIndicator, { backgroundColor: config.enabled ? '#10b981' : '#64748b' }]} />
            <Text style={styles.statusTitle}>
              {config.enabled ? '已连接' : '未连接'}
            </Text>
          </View>
          {config.enabled && (
            <View style={styles.statusDetails}>
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>上次同步</Text>
                <Text style={styles.statusValue}>
                  {config.lastSync ? new Date(config.lastSync).toLocaleString() : '从未同步'}
                </Text>
              </View>
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>同步频率</Text>
                <Text style={styles.statusValue}>
                  {syncFrequencies.find(f => f.id === config.syncFrequency)?.name || '手动'}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* 系统选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择系统</Text>
          <View style={styles.systemsGrid}>
            {erpSystems.map(system => (
              <TouchableOpacity
                key={system.id}
                style={[
                  styles.systemCard,
                  config.systemType === system.id && styles.systemCardActive
                ]}
                onPress={() => isEditing && setConfig({ ...config, systemType: system.id })}
                disabled={!isEditing}
              >
                <View style={[
                  styles.systemIcon,
                  config.systemType === system.id && styles.systemIconActive
                ]}>
                  <Icon name="database" size={24} color={config.systemType === system.id ? '#fff' : '#64748b'} />
                </View>
                <Text style={[
                  styles.systemName,
                  config.systemType === system.id && styles.systemNameActive
                ]}>
                  {system.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 连接配置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>连接配置</Text>
          <View style={styles.configCard}>
            <View style={styles.configItem}>
              <Text style={styles.configLabel}>API地址</Text>
              <TextInput
                style={[styles.configInput, !isEditing && styles.configInputDisabled]}
                value={config.apiEndpoint}
                onChangeText={(text) => setConfig({ ...config, apiEndpoint: text })}
                placeholder="请输入API地址"
                placeholderTextColor="#64748b"
                editable={isEditing}
              />
            </View>
            <View style={styles.configDivider} />
            <View style={styles.configItem}>
              <Text style={styles.configLabel}>账号</Text>
              <TextInput
                style={[styles.configInput, !isEditing && styles.configInputDisabled]}
                value={config.username}
                onChangeText={(text) => setConfig({ ...config, username: text })}
                placeholder="请输入账号"
                placeholderTextColor="#64748b"
                editable={isEditing}
              />
            </View>
            <View style={styles.configDivider} />
            <View style={styles.configItem}>
              <Text style={styles.configLabel}>密码</Text>
              <TextInput
                style={[styles.configInput, !isEditing && styles.configInputDisabled]}
                value={config.password}
                onChangeText={(text) => setConfig({ ...config, password: text })}
                placeholder="请输入密码"
                placeholderTextColor="#64748b"
                secureTextEntry
                editable={isEditing}
              />
            </View>
          </View>
        </View>

        {/* 同步设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>同步设置</Text>
          <View style={styles.configCard}>
            <View style={styles.configItem}>
              <Text style={styles.configLabel}>启用同步</Text>
              <Switch
                value={config.enabled}
                onValueChange={(value) => isEditing && setConfig({ ...config, enabled: value })}
                disabled={!isEditing}
                trackColor={{ false: '#334155', true: '#3b82f6' }}
              />
            </View>
            <View style={styles.configDivider} />
            <View style={styles.configItem}>
              <Text style={styles.configLabel}>同步频率</Text>
              <View style={styles.frequencyOptions}>
                {syncFrequencies.map(freq => (
                  <TouchableOpacity
                    key={freq.id}
                    style={[
                      styles.frequencyOption,
                      config.syncFrequency === freq.id && styles.frequencyOptionActive
                    ]}
                    onPress={() => isEditing && setConfig({ ...config, syncFrequency: freq.id })}
                    disabled={!isEditing}
                  >
                    <Text style={[
                      styles.frequencyOptionText,
                      config.syncFrequency === freq.id && styles.frequencyOptionTextActive
                    ]}>
                      {freq.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* 数据类型 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>同步数据类型</Text>
          <View style={styles.configCard}>
            {[
              { id: 'employee', label: '员工数据' },
              { id: 'customer', label: '客户数据' },
              { id: 'task', label: '任务数据' },
            ].map(item => (
              <View key={item.id} style={styles.syncItem}>
                <View style={styles.syncItemLeft}>
                  <Icon name="check-circle" size={18} color="#10b981" />
                  <Text style={styles.syncItemLabel}>{item.label}</Text>
                </View>
                <Text style={styles.syncItemStatus}>已启用</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 操作按钮 */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleTestConnection}>
            <Icon name="plug" size={18} color="#3b82f6" />
            <Text style={styles.actionButtonText}>测试连接</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.syncButton]} onPress={handleSync}>
            <Icon name="sync-alt" size={18} color="#fff" />
            <Text style={[styles.actionButtonText, styles.syncButtonText]}>立即同步</Text>
          </TouchableOpacity>
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
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#3b82f620',
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: 14,
    color: '#3b82f6',
    marginLeft: 6,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statusCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
  },
  statusDetails: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 12,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  statusValue: {
    fontSize: 14,
    color: '#f8fafc',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 12,
  },
  systemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  systemCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  systemCardActive: {
    borderColor: '#3b82f6',
  },
  systemIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  systemIconActive: {
    backgroundColor: '#3b82f6',
  },
  systemName: {
    fontSize: 14,
    color: '#94a3b8',
  },
  systemNameActive: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  configCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
  },
  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  configLabel: {
    fontSize: 15,
    color: '#f8fafc',
    flex: 1,
  },
  configInput: {
    flex: 2,
    backgroundColor: '#0f172a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f8fafc',
    fontSize: 14,
    textAlign: 'right',
  },
  configInputDisabled: {
    backgroundColor: '#334155',
    color: '#64748b',
  },
  configDivider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 12,
  },
  frequencyOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    flex: 2,
  },
  frequencyOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#334155',
    borderRadius: 6,
    marginLeft: 8,
    marginBottom: 4,
  },
  frequencyOptionActive: {
    backgroundColor: '#3b82f6',
  },
  frequencyOptionText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  frequencyOptionTextActive: {
    color: '#fff',
  },
  syncItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  syncItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncItemLabel: {
    fontSize: 15,
    color: '#f8fafc',
    marginLeft: 12,
  },
  syncItemStatus: {
    fontSize: 13,
    color: '#10b981',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  actionButtonText: {
    fontSize: 15,
    color: '#3b82f6',
    marginLeft: 8,
    fontWeight: '600',
  },
  syncButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  syncButtonText: {
    color: '#fff',
  },
});
