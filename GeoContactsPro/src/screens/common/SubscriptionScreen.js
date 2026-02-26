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
import { useApp, SUBSCRIPTION_PLANS } from '../../context/AppContext';

export default function SubscriptionScreen() {
  const { subscription, subscribe, cancelSubscription, toggleAutoRenew } = useApp();

  const currentPlan = SUBSCRIPTION_PLANS[subscription.plan];
  const isSubscribed = subscription.plan !== 'free';

  const handleSubscribe = (planKey) => {
    const plan = SUBSCRIPTION_PLANS[planKey];
    Alert.alert(
      '确认订阅',
      `您将订阅${plan.name}，价格为¥${plan.price}/${plan.period === 'month' ? '月' : plan.period === 'quarter' ? '季' : '年'}`,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确认', 
          onPress: () => {
            subscribe(plan);
            Alert.alert('订阅成功', `您已成功订阅${plan.name}`);
          }
        },
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      '取消订阅',
      '确定要取消订阅吗？取消后将在当前订阅期结束后恢复为免费版。',
      [
        { text: '保留订阅', style: 'cancel' },
        { text: '确认取消', onPress: cancelSubscription, style: 'destructive' },
      ]
    );
  };

  const features = [
    { icon: 'users', label: '分组数量', free: '最多10个', pro: '无限制' },
    { icon: 'tags', label: '标签数量', free: '最多20个', pro: '无限制' },
    { icon: 'brain', label: 'AI预测', free: '沟通3个/相遇2个', pro: '无限制' },
    { icon: 'chart-line', label: '预测准确率', free: '70%/65%', pro: '80%/75%' },
    { icon: 'shield-alt', label: '守护对象', free: '最多3个', pro: '无限制' },
    { icon: 'video', label: '实时视频', free: '不支持', pro: '支持' },
    { icon: 'route', label: '轨迹分析', free: '不支持', pro: '支持' },
    { icon: 'cube', label: 'AR功能', free: '不支持', pro: '支持' },
    { icon: 'database', label: '备份容量', free: '500MB', pro: '无限制' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>高级订阅</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 当前订阅状态 */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View>
              <Text style={styles.statusLabel}>当前套餐</Text>
              <Text style={styles.statusPlan}>{currentPlan.name}</Text>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: isSubscribed ? '#10b98120' : '#64748b20' }
            ]}>
              <Text style={[
                styles.statusBadgeText,
                { color: isSubscribed ? '#10b981' : '#64748b' }
              ]}>
                {isSubscribed ? '订阅中' : '免费版'}
              </Text>
            </View>
          </View>
          {isSubscribed && (
            <View style={styles.statusDetails}>
              <View style={styles.statusItem}>
                <Text style={styles.statusItemLabel}>到期时间</Text>
                <Text style={styles.statusItemValue}>
                  {new Date(subscription.endDate).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.statusItem}>
                <Text style={styles.statusItemLabel}>自动续费</Text>
                <TouchableOpacity onPress={toggleAutoRenew}>
                  <Text style={[
                    styles.statusItemValue,
                    { color: subscription.autoRenew ? '#10b981' : '#64748b' }
                  ]}>
                    {subscription.autoRenew ? '已开启' : '已关闭'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* 功能对比 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>功能对比</Text>
          <View style={styles.featuresCard}>
            <View style={styles.featuresHeader}>
              <Text style={[styles.featureHeaderCell, { flex: 1.5 }]}>功能</Text>
              <Text style={styles.featureHeaderCell}>免费版</Text>
              <Text style={[styles.featureHeaderCell, { color: '#3b82f6' }]}>高级版</Text>
            </View>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <View style={[styles.featureCell, { flex: 1.5, flexDirection: 'row', alignItems: 'center' }]}>
                  <Icon name={feature.icon} size={14} color="#64748b" style={{ marginRight: 8 }} />
                  <Text style={styles.featureLabel}>{feature.label}</Text>
                </View>
                <Text style={styles.featureCell}>{feature.free}</Text>
                <Text style={[styles.featureCell, { color: '#3b82f6', fontWeight: '600' }]}>
                  {feature.pro}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 订阅选项 */}
        {!isSubscribed && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>选择套餐</Text>
            <View style={styles.plansContainer}>
              {Object.entries(SUBSCRIPTION_PLANS)
                .filter(([key]) => key !== 'free')
                .map(([key, plan]) => (
                <TouchableOpacity
                  key={key}
                  style={styles.planCard}
                  onPress={() => handleSubscribe(key)}
                >
                  <View style={styles.planHeader}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <View style={styles.planPrice}>
                      <Text style={styles.planPriceSymbol}>¥</Text>
                      <Text style={styles.planPriceValue}>{plan.price}</Text>
                    </View>
                    <Text style={styles.planPeriod}>
                      /{plan.period === 'month' ? '月' : plan.period === 'quarter' ? '季' : '年'}
                    </Text>
                  </View>
                  <View style={styles.planFeatures}>
                    <View style={styles.planFeatureItem}>
                      <Icon name="check" size={12} color="#10b981" />
                      <Text style={styles.planFeatureText}>全部高级功能</Text>
                    </View>
                    <View style={styles.planFeatureItem}>
                      <Icon name="check" size={12} color="#10b981" />
                      <Text style={styles.planFeatureText}>优先客服支持</Text>
                    </View>
                    {key === 'yearly' && (
                      <View style={styles.bestValueBadge}>
                        <Text style={styles.bestValueText}>最优惠</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity style={styles.subscribeButton}>
                    <Text style={styles.subscribeButtonText}>立即订阅</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 取消订阅 */}
        {isSubscribed && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>取消订阅</Text>
          </TouchableOpacity>
        )}

        {/* 说明 */}
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            订阅说明：{'\n'}
            • 订阅费用将通过您的支付账户收取{'\n'}
            • 订阅自动续费，可随时取消{'\n'}
            • 取消订阅后，当前订阅期内仍可继续使用高级功能{'\n'}
            • 7天内未使用可申请全额退款
          </Text>
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
  statusCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  statusPlan: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusDetails: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 16,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusItemLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  statusItemValue: {
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
  featuresCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    overflow: 'hidden',
  },
  featuresHeader: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#334155',
  },
  featureHeaderCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
    textAlign: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    alignItems: 'center',
  },
  featureCell: {
    flex: 1,
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  featureLabel: {
    fontSize: 13,
    color: '#f8fafc',
  },
  plansContainer: {
    gap: 12,
  },
  planCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#334155',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
    flex: 1,
  },
  planPrice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  planPriceSymbol: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  planPriceValue: {
    fontSize: 32,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  planPeriod: {
    fontSize: 14,
    color: '#94a3b8',
    marginLeft: 2,
  },
  planFeatures: {
    marginBottom: 16,
  },
  planFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  planFeatureText: {
    fontSize: 13,
    color: '#94a3b8',
    marginLeft: 8,
  },
  bestValueBadge: {
    position: 'absolute',
    top: -8,
    right: 0,
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  bestValueText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: 'bold',
  },
  subscribeButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#ef444420',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelButtonText: {
    fontSize: 15,
    color: '#ef4444',
    fontWeight: '600',
  },
  notice: {
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    marginBottom: 40,
  },
  noticeText: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 20,
  },
});
