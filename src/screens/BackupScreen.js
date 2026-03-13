import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../context/AppContext';
import { collectBackupData, exportBackup, importBackup, applyRestore } from '../utils/backup';

const BackupScreen = ({ navigation }) => {
  const { contacts, categoryDimensions, defaultNavigation, settings, sosContacts } = useApp();
  const [loading, setLoading] = useState(false);
  const [lastBackup, setLastBackup] = useState(null);

  const handleBackup = async () => {
    setLoading(true);
    try {
      const data = await collectBackupData();
      data.contacts = contacts;
      data.categoryDimensions = categoryDimensions;
      const uri = await exportBackup(data);
      setLastBackup(new Date().toLocaleString('zh-CN'));
      Alert.alert('备份成功', '数据已导出，请保存备份文件。\n\n包含 ' + contacts.length + ' 位联系人');
    } catch (e) {
      Alert.alert('备份失败', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    Alert.alert('恢复数据', '恢复将覆盖当前所有数据，是否继续？', [
      { text: '取消', style: 'cancel' },
      {
        text: '继续',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            const data = await importBackup();
            if (!data) return setLoading(false);
            await applyRestore(data);
            Alert.alert('恢复成功', '数据已恢复，请重启应用以生效。');
          } catch (e) {
            Alert.alert('恢复失败', e.message);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>数据备份与恢复</Text>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>处理中...</Text>
        </View>
      )}

      {/* 备份信息 */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Icon name="users" size={20} color="#3b82f6" />
          <Text style={styles.infoText}>{contacts.length} 位联系人</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="sitemap" size={20} color="#8b5cf6" />
          <Text style={styles.infoText}>分类数据已就绪</Text>
        </View>
        {lastBackup && (
          <View style={styles.infoRow}>
            <Icon name="clock" size={20} color="#10b981" />
            <Text style={styles.infoText}>上次备份: {lastBackup}</Text>
          </View>
        )}
      </View>

      {/* 备份按钮 */}
      <TouchableOpacity style={styles.primaryBtn} onPress={handleBackup} disabled={loading}>
        <Icon name="cloud-upload-alt" size={24} color="#fff" />
        <View style={styles.btnTextWrap}>
          <Text style={styles.btnTitle}>备份数据</Text>
          <Text style={styles.btnSubtitle}>导出联系人、分类、设置到文件</Text>
        </View>
        <Icon name="chevron-right" size={16} color="rgba(255,255,255,0.5)" />
      </TouchableOpacity>

      {/* 恢复按钮 */}
      <TouchableOpacity style={styles.secondaryBtn} onPress={handleRestore} disabled={loading}>
        <Icon name="cloud-download-alt" size={24} color="#f59e0b" />
        <View style={styles.btnTextWrap}>
          <Text style={styles.btnTitle}>恢复数据</Text>
          <Text style={styles.btnSubtitle}>从备份文件恢复所有数据</Text>
        </View>
        <Icon name="chevron-right" size={16} color="rgba(255,255,255,0.5)" />
      </TouchableOpacity>

      {/* 提示 */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>💡 提示</Text>
        <Text style={styles.tipItem}>• 建议定期备份数据，防止意外丢失</Text>
        <Text style={styles.tipItem}>• 备份文件为 JSON 格式，也可手动编辑</Text>
        <Text style={styles.tipItem}>• 恢复操作会覆盖当前数据，请谨慎操作</Text>
        <Text style={styles.tipItem}>• 应用重大更新前建议先备份</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 56 },
  backBtn: { padding: 8, marginRight: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  loadingOverlay: { padding: 40, alignItems: 'center' },
  loadingText: { color: '#94a3b8', marginTop: 12 },
  infoCard: { margin: 16, padding: 16, backgroundColor: 'rgba(30,41,59,0.7)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 12 },
  infoText: { color: '#e2e8f0', fontSize: 14 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginVertical: 8, padding: 20, backgroundColor: 'rgba(59,130,246,0.2)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(59,130,246,0.3)' },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginVertical: 8, padding: 20, backgroundColor: 'rgba(245,158,11,0.1)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)' },
  btnTextWrap: { flex: 1, marginHorizontal: 16 },
  btnTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  btnSubtitle: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  tipsCard: { margin: 16, padding: 16, backgroundColor: 'rgba(30,41,59,0.5)', borderRadius: 12 },
  tipsTitle: { fontSize: 14, fontWeight: '600', color: '#fbbf24', marginBottom: 8 },
  tipItem: { fontSize: 13, color: '#94a3b8', marginBottom: 4 },
});

export default BackupScreen;
