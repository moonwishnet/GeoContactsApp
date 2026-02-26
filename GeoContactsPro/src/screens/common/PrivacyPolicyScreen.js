import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const PrivacyPolicyScreen = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>隐私政策</Text>
        <Text style={styles.date}>最后更新日期：2024年1月1日</Text>

        <Text style={styles.sectionTitle}>1. 引言</Text>
        <Text style={styles.paragraph}>
          GeoContacts+ Pro（以下简称"我们"或"本应用"）高度重视用户的隐私保护。本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息。请您在使用本应用前仔细阅读本隐私政策。
        </Text>

        <Text style={styles.sectionTitle}>2. 我们收集的信息</Text>
        <Text style={styles.paragraph}>
          为了提供服务，我们可能会收集以下信息：
        </Text>
        <Text style={styles.bullet}>• 联系人信息：姓名、电话号码、地址等</Text>
        <Text style={styles.bullet}>• 位置信息：用于显示附近联系人和距离计算</Text>
        <Text style={styles.bullet}>• 设备信息：设备型号、操作系统版本等</Text>
        <Text style={styles.bullet}>• 使用数据：应用使用情况和功能访问记录</Text>

        <Text style={styles.sectionTitle}>3. 信息存储</Text>
        <Text style={styles.paragraph}>
          我们采用本地存储方式，您的所有数据（包括联系人信息、位置记录等）均存储在您的设备本地。我们不会将您的数据上传至任何服务器，除非您明确授权进行数据备份。
        </Text>

        <Text style={styles.sectionTitle}>4. 信息安全</Text>
        <Text style={styles.paragraph}>
          我们采用行业标准的加密技术保护您的数据安全。所有敏感数据均经过加密处理，防止未经授权的访问。我们建议您设置设备锁屏密码，以进一步保护您的数据安全。
        </Text>

        <Text style={styles.sectionTitle}>5. 您的权利</Text>
        <Text style={styles.paragraph}>
          您拥有以下权利：
        </Text>
        <Text style={styles.bullet}>• 访问和查看您的个人数据</Text>
        <Text style={styles.bullet}>• 修改或更新您的个人信息</Text>
        <Text style={styles.bullet}>• 删除您的账户和所有相关数据</Text>
        <Text style={styles.bullet}>• 导出您的数据到本地文件</Text>

        <Text style={styles.sectionTitle}>6. 联系我们</Text>
        <Text style={styles.paragraph}>
          如果您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：
        </Text>
        <Text style={styles.bullet}>• 邮箱：privacy@geocontacts.pro</Text>
        <Text style={styles.bullet}>• 电话：400-123-4567</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  date: { fontSize: 14, color: '#64748b', marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginTop: 24, marginBottom: 12 },
  paragraph: { fontSize: 14, color: '#94a3b8', lineHeight: 22, marginBottom: 12 },
  bullet: { fontSize: 14, color: '#94a3b8', lineHeight: 24, marginLeft: 8, marginBottom: 4 },
});

export default PrivacyPolicyScreen;
