import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../context/AppContext';

const ModeSwitchModal = ({ visible, onClose }) => {
  const { appMode, saveAppMode } = useApp();

  const handleSwitchMode = async (mode) => {
    await saveAppMode(mode);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>切换应用模式</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="times" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            选择您要使用的应用模式，切换后需要重新启动应用
          </Text>

          <TouchableOpacity
            style={[
              styles.modeOption,
              appMode === 'personal' && styles.modeOptionActive,
            ]}
            onPress={() => handleSwitchMode('personal')}
          >
            <View style={[styles.modeIcon, { backgroundColor: '#3b82f620' }]}>
              <Icon name="user" size={24} color="#3b82f6" />
            </View>
            <View style={styles.modeInfo}>
              <Text style={styles.modeName}>个人版</Text>
              <Text style={styles.modeDescription}>
                时空通讯录、AI预测、安全守护
              </Text>
            </View>
            {appMode === 'personal' && (
              <Icon name="check-circle" size={20} color="#3b82f6" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeOption,
              appMode === 'enterprise' && styles.modeOptionActive,
            ]}
            onPress={() => handleSwitchMode('enterprise')}
          >
            <View style={[styles.modeIcon, { backgroundColor: '#10b98120' }]}>
              <Icon name="building" size={24} color="#10b981" />
            </View>
            <View style={styles.modeInfo}>
              <Text style={styles.modeName}>企业版</Text>
              <Text style={styles.modeDescription}>
                组织架构、外勤打卡、客户管理
              </Text>
            </View>
            {appMode === 'enterprise' && (
              <Icon name="check-circle" size={20} color="#10b981" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeOption,
              appMode === 'government' && styles.modeOptionActive,
            ]}
            onPress={() => handleSwitchMode('government')}
          >
            <View style={[styles.modeIcon, { backgroundColor: '#8b5cf620' }]}>
              <Icon name="landmark" size={24} color="#8b5cf6" />
            </View>
            <View style={styles.modeInfo}>
              <Text style={styles.modeName}>政企版</Text>
              <Text style={styles.modeDescription}>
                人员监管、位置监控、数据统计
              </Text>
            </View>
            {appMode === 'government' && (
              <Icon name="check-circle" size={20} color="#8b5cf6" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 360,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  description: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 20,
    lineHeight: 20,
  },
  modeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modeOptionActive: {
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  modeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modeInfo: {
    flex: 1,
  },
  modeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 12,
    color: '#94a3b8',
  },
});

export default ModeSwitchModal;
