import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const PrivacyConsentModal = ({ visible, onAgree, onDecline }) => {
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleAgree = () => {
    if (agreedToPolicy && agreedToTerms) {
      onAgree();
    }
  };

  const openPrivacyPolicy = () => {
    // 实际应用中应该打开隐私政策页面
    Linking.openURL('https://geocontacts.pro/privacy-policy');
  };

  const openUserAgreement = () => {
    // 实际应用中应该打开用户协议页面
    Linking.openURL('https://geocontacts.pro/user-agreement');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Icon name="shield-alt" size={40} color="#3b82f6" />
            <Text style={styles.title}>欢迎使用 GeoContacts+ Pro</Text>
            <Text style={styles.subtitle}>
              在使用前，请您阅读并同意以下条款
            </Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>隐私保护承诺</Text>
              <Text style={styles.sectionText}>
                我们高度重视您的隐私安全，承诺：
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• 您的联系人数据仅存储在本地设备</Text>
                <Text style={styles.bulletItem}>• 位置信息仅在您授权后使用</Text>
                <Text style={styles.bulletItem}>• 不会将您的数据上传至第三方服务器</Text>
                <Text style={styles.bulletItem}>• 支持数据加密存储和导出</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>权限说明</Text>
              <Text style={styles.sectionText}>
                为了提供完整的服务，我们需要以下权限：
              </Text>
              <View style={styles.permissionList}>
                <View style={styles.permissionItem}>
                  <Icon name="map-marker-alt" size={16} color="#3b82f6" />
                  <Text style={styles.permissionText}>位置权限 - 用于显示附近联系人和距离计算</Text>
                </View>
                <View style={styles.permissionItem}>
                  <Icon name="address-book" size={16} color="#3b82f6" />
                  <Text style={styles.permissionText}>联系人权限 - 用于导入手机通讯录</Text>
                </View>
                <View style={styles.permissionItem}>
                  <Icon name="phone" size={16} color="#3b82f6" />
                  <Text style={styles.permissionText}>电话权限 - 用于拨打电话功能</Text>
                </View>
                <View style={styles.permissionItem}>
                  <Icon name="comment" size={16} color="#3b82f6" />
                  <Text style={styles.permissionText}>短信权限 - 用于SOS紧急求助</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.agreementSection}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setAgreedToPolicy(!agreedToPolicy)}
            >
              <View style={[styles.checkbox, agreedToPolicy && styles.checkboxChecked]}>
                {agreedToPolicy && <Icon name="check" size={12} color="#fff" />}
              </View>
              <Text style={styles.checkboxText}>
                我已阅读并同意
                <Text style={styles.link} onPress={openPrivacyPolicy}>
                  《隐私政策》
                </Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
            >
              <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                {agreedToTerms && <Icon name="check" size={12} color="#fff" />}
              </View>
              <Text style={styles.checkboxText}>
                我已阅读并同意
                <Text style={styles.link} onPress={openUserAgreement}>
                  《用户协议》
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={onDecline}
            >
              <Text style={styles.declineButtonText}>不同意并退出</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.agreeButton,
                (!agreedToPolicy || !agreedToTerms) && styles.agreeButtonDisabled,
              ]}
              onPress={handleAgree}
              disabled={!agreedToPolicy || !agreedToTerms}
            >
              <Text style={styles.agreeButtonText}>同意并继续</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 22,
  },
  bulletList: {
    marginTop: 8,
  },
  bulletItem: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 24,
  },
  permissionList: {
    marginTop: 8,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  permissionText: {
    fontSize: 13,
    color: '#94a3b8',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  agreementSection: {
    marginVertical: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#3b82f6',
  },
  checkboxText: {
    fontSize: 14,
    color: '#94a3b8',
    flex: 1,
  },
  link: {
    color: '#3b82f6',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  declineButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(100, 116, 139, 0.3)',
    alignItems: 'center',
  },
  declineButtonText: {
    fontSize: 15,
    color: '#94a3b8',
    fontWeight: '600',
  },
  agreeButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
  },
  agreeButtonDisabled: {
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
  },
  agreeButtonText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
});

export default PrivacyConsentModal;
