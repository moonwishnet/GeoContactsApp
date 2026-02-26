import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../../context/AppContext';

export default function DataExportScreen() {
  const { contacts, encryptData } = useApp();
  const [exportFormat, setExportFormat] = useState('csv');
  const [encryptExport, setEncryptExport] = useState(true);
  const [selectedData, setSelectedData] = useState({
    contacts: true,
    tags: true,
    groups: false,
    settings: false,
  });

  const formats = [
    { id: 'csv', name: 'CSV', icon: 'file-csv', desc: '通用表格格式' },
    { id: 'excel', name: 'Excel', icon: 'file-excel', desc: 'Microsoft Excel' },
    { id: 'json', name: 'JSON', icon: 'file-code', desc: '结构化数据' },
    { id: 'vcard', name: 'vCard', icon: 'address-card', desc: '通讯录标准格式' },
  ];

  const dataTypes = [
    { id: 'contacts', name: '联系人', count: contacts.length },
    { id: 'tags', name: '时空标签', count: 12 },
    { id: 'groups', name: '分组', count: 5 },
    { id: 'settings', name: '设置', count: null },
  ];

  const toggleDataType = (type) => {
    setSelectedData(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleExport = async () => {
    const selectedTypes = Object.entries(selectedData)
      .filter(([_, selected]) => selected)
      .map(([type]) => type);

    if (selectedTypes.length === 0) {
      Alert.alert('提示', '请至少选择一项数据');
      return;
    }

    Alert.alert(
      '确认导出',
      `将导出${selectedTypes.length}类数据，格式为${exportFormat.toUpperCase()}${encryptExport ? '（加密）' : ''}`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '导出',
          onPress: () => {
            Alert.alert('导出成功', '数据已保存到下载文件夹');
          }
        },
      ]
    );
  };

  const handleImport = () => {
    Alert.alert(
      '导入数据',
      '选择导入方式',
      [
        { text: '取消', style: 'cancel' },
        { text: '从文件', onPress: () => Alert.alert('请选择文件') },
        { text: '从云端', onPress: () => Alert.alert('云端同步') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>数据导入导出</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 导出格式选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>导出格式</Text>
          <View style={styles.formatsGrid}>
            {formats.map(format => (
              <TouchableOpacity
                key={format.id}
                style={[
                  styles.formatCard,
                  exportFormat === format.id && styles.formatCardActive
                ]}
                onPress={() => setExportFormat(format.id)}
              >
                <Icon 
                  name={format.icon} 
                  size={28} 
                  color={exportFormat === format.id ? '#3b82f6' : '#64748b'} 
                />
                <Text style={[
                  styles.formatName,
                  exportFormat === format.id && styles.formatNameActive
                ]}>
                  {format.name}
                </Text>
                <Text style={styles.formatDesc}>{format.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 数据选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择数据</Text>
          <View style={styles.dataTypesCard}>
            {dataTypes.map(type => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.dataTypeItem,
                  selectedData[type.id] && styles.dataTypeItemSelected
                ]}
                onPress={() => toggleDataType(type.id)}
              >
                <View style={styles.dataTypeLeft}>
                  <View style={[
                    styles.checkbox,
                    selectedData[type.id] && styles.checkboxChecked
                  ]}>
                    {selectedData[type.id] && (
                      <Icon name="check" size={12} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.dataTypeName}>{type.name}</Text>
                </View>
                <Text style={styles.dataTypeCount}>
                  {type.count !== null ? `${type.count}项` : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 加密选项 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>安全选项</Text>
          <View style={styles.securityCard}>
            <View style={styles.securityItem}>
              <View style={styles.securityItemLeft}>
                <Icon name="lock" size={18} color="#3b82f6" />
                <View style={styles.securityItemInfo}>
                  <Text style={styles.securityItemTitle}>加密导出</Text>
                  <Text style={styles.securityItemDesc}>使用AES-256加密保护数据</Text>
                </View>
              </View>
              <Switch
                value={encryptExport}
                onValueChange={setEncryptExport}
                trackColor={{ false: '#334155', true: '#3b82f6' }}
              />
            </View>
          </View>
        </View>

        {/* 导入功能 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>导入数据</Text>
          <TouchableOpacity style={styles.importCard} onPress={handleImport}>
            <View style={styles.importIcon}>
              <Icon name="file-import" size={24} color="#10b981" />
            </View>
            <View style={styles.importInfo}>
              <Text style={styles.importTitle}>从文件导入</Text>
              <Text style={styles.importDesc}>支持 CSV、Excel、vCard 格式</Text>
            </View>
            <Icon name="chevron-right" size={16} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* 历史记录 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>历史记录</Text>
          <View style={styles.historyCard}>
            <View style={styles.historyItem}>
              <View style={styles.historyIcon}>
                <Icon name="file-export" size={16} color="#3b82f6" />
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyTitle}>导出联系人</Text>
                <Text style={styles.historyTime}>2024-02-20 15:30</Text>
              </View>
              <Text style={styles.historyStatus}>成功</Text>
            </View>
            <View style={styles.historyDivider} />
            <View style={styles.historyItem}>
              <View style={styles.historyIcon}>
                <Icon name="file-import" size={16} color="#10b981" />
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyTitle}>导入联系人</Text>
                <Text style={styles.historyTime}>2024-02-15 10:20</Text>
              </View>
              <Text style={styles.historyStatus}>成功</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
          <Icon name="file-export" size={18} color="#fff" />
          <Text style={styles.exportButtonText}>导出数据</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
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
  content: {
    flex: 1,
    padding: 16,
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
  formatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  formatCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  formatCardActive: {
    borderColor: '#3b82f6',
  },
  formatName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 8,
  },
  formatNameActive: {
    color: '#3b82f6',
  },
  formatDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  dataTypesCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 8,
  },
  dataTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
  },
  dataTypeItemSelected: {
    backgroundColor: '#3b82f620',
  },
  dataTypeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#64748b',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  dataTypeName: {
    fontSize: 15,
    color: '#f8fafc',
  },
  dataTypeCount: {
    fontSize: 13,
    color: '#64748b',
  },
  securityCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  securityItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  securityItemInfo: {
    marginLeft: 12,
    flex: 1,
  },
  securityItemTitle: {
    fontSize: 15,
    color: '#f8fafc',
  },
  securityItemDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  importCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
  },
  importIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#10b98120',
    justifyContent: 'center',
    alignItems: 'center',
  },
  importInfo: {
    flex: 1,
    marginLeft: 16,
  },
  importTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f8fafc',
  },
  importDesc: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  historyCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  historyTitle: {
    fontSize: 14,
    color: '#f8fafc',
  },
  historyTime: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  historyStatus: {
    fontSize: 13,
    color: '#10b981',
  },
  historyDivider: {
    height: 1,
    backgroundColor: '#334155',
    marginHorizontal: 12,
  },
  bottomBar: {
    padding: 16,
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 8,
  },
  exportButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
});
