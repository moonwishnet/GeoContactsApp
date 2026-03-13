import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Contacts from 'expo-contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AutoImportManager = ({ contacts, addContacts, loaded }) => {
  const [showInitialModal, setShowInitialModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importing, setImporting] = useState(false);
  const [importCount, setImportCount] = useState(0);
  const [statusText, setStatusText] = useState('');
  const progressAnim = useRef(new Animated.Value(0)).current;

  // 检查是否是首次使用（没有联系人）
  useEffect(() => {
    if (!loaded || Platform.OS === 'web') return;

    const checkFirstTime = async () => {
      try {
        // 检查是否已经显示过初始导入提示
        const hasShownInitialImport = await AsyncStorage.getItem('hasShownInitialImport');
        
        // 如果没有联系人且没有显示过初始导入
        if (contacts.length === 0 && !hasShownInitialImport) {
          // 检查通讯录权限状态
          const { status } = await Contacts.getPermissionsAsync();
          
          if (status !== 'granted') {
            // 显示初始导入确认框
            setShowInitialModal(true);
          }
        }
      } catch (error) {
        console.error('检查首次使用失败:', error);
      }
    };

    checkFirstTime();
  }, [loaded, contacts.length]);

  // 检测新联系人（应用启动时）
  useEffect(() => {
    if (!loaded || Platform.OS === 'web' || contacts.length === 0) return;

    const checkNewContacts = async () => {
      try {
        // 检查权限
        const { status } = await Contacts.getPermissionsAsync();
        if (status !== 'granted') return;

        // 获取上次同步时间
        const lastSyncTime = await AsyncStorage.getItem('lastContactsSyncTime');
        const lastSync = lastSyncTime ? parseInt(lastSyncTime) : 0;

        // 获取手机通讯录
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });

        // 获取已导入的电话号码集合
        const existingPhones = new Set(
          contacts.map(c => c.phone.replace(/\s/g, ''))
        );

        // 找出新联系人
        const newContacts = [];
        for (const contact of data) {
          if (!contact.phoneNumbers || contact.phoneNumbers.length === 0) continue;
          
          const phone = contact.phoneNumbers[0].number.replace(/\s/g, '');
          
          // 检查是否是新联系人
          if (!existingPhones.has(phone)) {
            newContacts.push(contact);
          }
        }

        // 如果有新联系人，自动导入
        if (newContacts.length > 0) {
          await importContactsWithProgress(newContacts, false);
          
          // 提示用户
          Alert.alert(
            '新联系人',
            `自动导入了 ${newContacts.length} 个新联系人`,
            [{ text: '知道了', style: 'default' }]
          );
        }

        // 更新同步时间
        await AsyncStorage.setItem('lastContactsSyncTime', Date.now().toString());
      } catch (error) {
        console.error('检测新联系人失败:', error);
      }
    };

    // 延迟执行，避免应用启动时过于繁忙
    const timer = setTimeout(checkNewContacts, 3000);
    return () => clearTimeout(timer);
  }, [loaded, contacts]);

  // 处理初始导入确认
  const handleInitialImportConfirm = async () => {
    setShowInitialModal(false);
    await AsyncStorage.setItem('hasShownInitialImport', 'true');
    
    // 请求权限
    const { status } = await Contacts.requestPermissionsAsync();
    
    if (status === 'granted') {
      // 开始导入
      await startFullImport();
    } else {
      Alert.alert('提示', '需要通讯录权限才能导入联系人，您可以在设置中手动开启');
    }
  };

  // 处理取消
  const handleInitialImportCancel = async () => {
    setShowInitialModal(false);
    await AsyncStorage.setItem('hasShownInitialImport', 'true');
  };

  // 开始完整导入
  const startFullImport = async () => {
    try {
      setImporting(true);
      setShowProgressModal(true);
      setProgress(0);
      setStatusText('正在读取通讯录...');

      // 获取所有联系人
      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.Name,
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Emails,
          Contacts.Fields.Addresses,
          Contacts.Fields.Company,
          Contacts.Fields.JobTitle,
          Contacts.Fields.Image,
        ],
      });

      // 过滤出有电话号码的联系人
      const validContacts = data.filter(c => c.phoneNumbers && c.phoneNumbers.length > 0);
      
      if (validContacts.length === 0) {
        setStatusText('通讯录为空');
        setTimeout(() => {
          setShowProgressModal(false);
          setImporting(false);
        }, 1500);
        return;
      }

      setStatusText(`找到 ${validContacts.length} 个联系人，开始导入...`);
      
      // 批量导入
      const importedContacts = [];
      const batchSize = 5; // 每批处理5个

      for (let i = 0; i < validContacts.length; i += batchSize) {
        const batch = validContacts.slice(i, i + batchSize);
        
        // 处理这一批
        for (const contact of batch) {
          const phone = contact.phoneNumbers[0].number.replace(/\s/g, '');
          
          let location = '未知位置';
          if (contact.addresses && contact.addresses.length > 0) {
            const address = contact.addresses[0];
            location = `${address.city || ''}${address.street || ''}`.trim() || '未知位置';
          }

          const newContact = {
            id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: contact.name || '未知姓名',
            phone: phone,
            avatar: contact.image?.uri || `https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.name || 'unknown'}`,
            distance: Math.random() * 10,
            distanceUnit: 'km',
            relationship: 3,
            status: 'offline',
            location: location,
            latitude: null,
            longitude: null,
            isFavorite: false,
            context: contact.company ? `${contact.company} ${contact.jobTitle || ''}`.trim() : '从通讯录导入',
            bestTime: '随时',
            lastContact: Date.now(),
            categories: [],
            tags: contact.jobTitle ? [contact.jobTitle] : [],
          };

          importedContacts.push(newContact);
        }

        // 更新进度
        const currentProgress = Math.min(((i + batch.length) / validContacts.length) * 100, 100);
        setProgress(currentProgress);
        setStatusText(`正在导入... ${Math.round(currentProgress)}%`);
        
        // 动画效果
        Animated.timing(progressAnim, {
          toValue: currentProgress,
          duration: 300,
          useNativeDriver: false,
        }).start();

        // 小延迟，让UI有时间更新
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // 添加到应用
      if (importedContacts.length > 0) {
        addContacts(importedContacts);
        setImportCount(importedContacts.length);
        setStatusText(`成功导入 ${importedContacts.length} 个联系人！`);
        
        // 保存同步时间
        await AsyncStorage.setItem('lastContactsSyncTime', Date.now().toString());
      }

      // 延迟关闭
      setTimeout(() => {
        setShowProgressModal(false);
        setImporting(false);
      }, 2000);

    } catch (error) {
      console.error('导入失败:', error);
      setStatusText('导入失败: ' + error.message);
      setTimeout(() => {
        setShowProgressModal(false);
        setImporting(false);
      }, 2000);
    }
  };

  // 导入新联系人（带进度）
  const importContactsWithProgress = async (newContacts, showModal = true) => {
    if (showModal) {
      setShowProgressModal(true);
    }
    setImporting(true);
    setProgress(0);
    setStatusText(`发现 ${newContacts.length} 个新联系人，正在导入...`);

    const importedContacts = [];
    const batchSize = 5;

    for (let i = 0; i < newContacts.length; i += batchSize) {
      const batch = newContacts.slice(i, i + batchSize);
      
      for (const contact of batch) {
        const phone = contact.phoneNumbers[0].number.replace(/\s/g, '');
        
        let location = '未知位置';
        if (contact.addresses && contact.addresses.length > 0) {
          const address = contact.addresses[0];
          location = `${address.city || ''}${address.street || ''}`.trim() || '未知位置';
        }

        const newContact = {
          id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: contact.name || '未知姓名',
          phone: phone,
          avatar: contact.image?.uri || `https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.name || 'unknown'}`,
          distance: Math.random() * 10,
          distanceUnit: 'km',
          relationship: 3,
          status: 'offline',
          location: location,
          latitude: null,
          longitude: null,
          isFavorite: false,
          context: contact.company ? `${contact.company} ${contact.jobTitle || ''}`.trim() : '从通讯录导入',
          bestTime: '随时',
          lastContact: Date.now(),
          categories: [],
          tags: contact.jobTitle ? [contact.jobTitle] : [],
        };

        importedContacts.push(newContact);
      }

      const currentProgress = Math.min(((i + batch.length) / newContacts.length) * 100, 100);
      setProgress(currentProgress);
      setStatusText(`正在导入... ${Math.round(currentProgress)}%`);
      
      Animated.timing(progressAnim, {
        toValue: currentProgress,
        duration: 300,
        useNativeDriver: false,
      }).start();

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (importedContacts.length > 0) {
      addContacts(importedContacts);
      setImportCount(importedContacts.length);
      setStatusText(`成功导入 ${importedContacts.length} 个联系人！`);
      await AsyncStorage.setItem('lastContactsSyncTime', Date.now().toString());
    }

    if (showModal) {
      setTimeout(() => {
        setShowProgressModal(false);
        setImporting(false);
      }, 1500);
    } else {
      setShowProgressModal(false);
      setImporting(false);
    }
  };

  // Web 平台不渲染
  if (Platform.OS === 'web') return null;

  return (
    <>
      {/* 初始导入确认弹窗 */}
      <Modal
        visible={showInitialModal}
        transparent
        animationType="fade"
        onRequestClose={handleInitialImportCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.initialModal}>
            <View style={styles.initialModalIcon}>
              <Icon name="address-book" size={48} color="#3b82f6" />
            </View>
            <Text style={styles.initialModalTitle}>导入通讯录</Text>
            <Text style={styles.initialModalText}>
              检测到您是首次使用，是否从手机通讯录导入联系人？
            </Text>
            <Text style={styles.initialModalSubtext}>
              导入后您可以更方便地管理和联系您的朋友
            </Text>
            <View style={styles.initialModalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleInitialImportCancel}
              >
                <Text style={styles.cancelButtonText}>稍后设置</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleInitialImportConfirm}
              >
                <Text style={styles.confirmButtonText}>立即导入</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 进度弹窗 */}
      <Modal
        visible={showProgressModal}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.progressModal}>
            <Icon name="sync-alt" size={40} color="#3b82f6" style={importing && styles.spinningIcon} />
            <Text style={styles.progressTitle}>
              {progress >= 100 ? '导入完成' : '正在导入'}
            </Text>
            <Text style={styles.progressStatus}>{statusText}</Text>
            
            {/* 进度条 */}
            <View style={styles.progressBarContainer}>
              <Animated.View 
                style={[
                  styles.progressBar,
                  { width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  })}
                ]}
              />
            </View>
            
            <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
            
            {progress >= 100 && importCount > 0 && (
              <Text style={styles.successText}>
                成功导入 {importCount} 个联系人
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  initialModal: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  initialModalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  initialModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  initialModalText: {
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  initialModalSubtext: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  initialModalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    color: '#94a3b8',
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  progressModal: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 32,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  spinningIcon: {
    transform: [{ rotate: '0deg' }],
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  progressStatus: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  successText: {
    fontSize: 14,
    color: '#10b981',
    marginTop: 12,
    fontWeight: '600',
  },
});

export default AutoImportManager;
