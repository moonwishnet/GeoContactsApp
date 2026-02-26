import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const UserAgreementScreen = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>用户协议</Text>
        <Text style={styles.date}>最后更新日期：2024年1月1日</Text>

        <Text style={styles.sectionTitle}>1. 协议范围</Text>
        <Text style={styles.paragraph}>
          本用户协议（以下简称"本协议"）是您与 GeoContacts+ Pro（以下简称"我们"或"本应用"）之间关于使用本应用服务的协议。请您在使用本应用前仔细阅读本协议。
        </Text>

        <Text style={styles.sectionTitle}>2. 服务说明</Text>
        <Text style={styles.paragraph}>
          GeoContacts+ Pro 是一款基于位置的智能通信录应用，提供以下服务：
        </Text>
        <Text style={styles.bullet}>• 时空通讯录管理</Text>
        <Text style={styles.bullet}>• 联系人位置显示和导航</Text>
        <Text style={styles.bullet}>• AI智能预测和提醒</Text>
        <Text style={styles.bullet}>• SOS紧急求助功能</Text>
        <Text style={styles.bullet}>• 企业版组织架构管理（仅限企业版）</Text>

        <Text style={styles.sectionTitle}>3. 用户责任</Text>
        <Text style={styles.paragraph}>
          您在使用本应用时应遵守以下规定：
        </Text>
        <Text style={styles.bullet}>• 不得使用本应用从事违法活动</Text>
        <Text style={styles.bullet}>• 不得侵犯他人的合法权益</Text>
        <Text style={styles.bullet}>• 不得干扰本应用的正常运行</Text>
        <Text style={styles.bullet}>• 妥善保管您的账户信息</Text>

        <Text style={styles.sectionTitle}>4. 免责声明</Text>
        <Text style={styles.paragraph}>
          本应用按"现状"提供，我们不保证：
        </Text>
        <Text style={styles.bullet}>• 服务不会中断或没有错误</Text>
        <Text style={styles.bullet}>• 任何缺陷都会被纠正</Text>
        <Text style={styles.bullet}>• 服务满足您的所有需求</Text>

        <Text style={styles.sectionTitle}>5. 知识产权</Text>
        <Text style={styles.paragraph}>
          本应用的所有内容（包括但不限于文字、图片、音频、视频、软件等）的知识产权均归我们所有或已获得合法授权。未经我们书面许可，您不得复制、修改、传播本应用的任何内容。
        </Text>

        <Text style={styles.sectionTitle}>6. 协议修改</Text>
        <Text style={styles.paragraph}>
          我们有权随时修改本协议。修改后的协议将在本应用内公布，您继续使用本应用即视为接受修改后的协议。
        </Text>

        <Text style={styles.sectionTitle}>7. 联系我们</Text>
        <Text style={styles.paragraph}>
          如果您对本协议有任何疑问，请通过以下方式联系我们：
        </Text>
        <Text style={styles.bullet}>• 邮箱：support@geocontacts.pro</Text>
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

export default UserAgreementScreen;
