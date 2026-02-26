import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

// Context
import { AppProvider, useApp } from './src/context/AppContext';

// Screens - Personal
import PersonalMapScreen from './src/screens/personal/MapScreen';
import PersonalContactsScreen from './src/screens/personal/ContactsScreen';
import PersonalPredictionScreen from './src/screens/personal/PredictionScreen';
import PersonalSafetyScreen from './src/screens/personal/SafetyScreen';
import PersonalProfileScreen from './src/screens/personal/ProfileScreen';

// Screens - Enterprise
import EnterpriseHomeScreen from './src/screens/enterprise/HomeScreen';
import EnterpriseOrgScreen from './src/screens/enterprise/OrgScreen';
import EnterpriseCheckInScreen from './src/screens/enterprise/CheckInScreen';
import EnterpriseCustomersScreen from './src/screens/enterprise/CustomersScreen';
import EnterpriseProfileScreen from './src/screens/enterprise/ProfileScreen';
import EnterpriseFieldTaskScreen from './src/screens/enterprise/FieldTaskScreen';
import EnterpriseDataAnalysisScreen from './src/screens/enterprise/DataAnalysisScreen';
import EnterpriseERPIntegrationScreen from './src/screens/enterprise/ERPIntegrationScreen';

// Screens - Government
import GovernmentHomeScreen from './src/screens/government/HomeScreen';
import GovernmentOrgScreen from './src/screens/government/OrgScreen';
import GovernmentMonitorScreen from './src/screens/government/MonitorScreen';
import GovernmentStatisticsScreen from './src/screens/government/StatisticsScreen';
import GovernmentProfileScreen from './src/screens/government/ProfileScreen';

// Screens - Common
import ContactDetailScreen from './src/screens/common/ContactDetailScreen';
import AddContactScreen from './src/screens/common/AddContactScreen';
import EditContactScreen from './src/screens/common/EditContactScreen';
import NavigationSettingsScreen from './src/screens/common/NavigationSettingsScreen';
import TagManagerScreen from './src/screens/common/TagManagerScreen';
import GroupManagerScreen from './src/screens/common/GroupManagerScreen';
import PrivacyPolicyScreen from './src/screens/common/PrivacyPolicyScreen';
import UserAgreementScreen from './src/screens/common/UserAgreementScreen';
import SOSAlertScreen from './src/screens/common/SOSAlertScreen';
import SubscriptionScreen from './src/screens/common/SubscriptionScreen';
import LifeServicesScreen from './src/screens/common/LifeServicesScreen';
import SocialScreen from './src/screens/common/SocialScreen';
import ARModeScreen from './src/screens/common/ARModeScreen';
import TrajectoryAnalysisScreen from './src/screens/common/TrajectoryAnalysisScreen';
import AuthorizationLogScreen from './src/screens/common/AuthorizationLogScreen';
import DataExportScreen from './src/screens/common/DataExportScreen';

// Components
import ModeSwitchModal from './src/components/ModeSwitchModal';
import PrivacyConsentModal from './src/components/PrivacyConsentModal';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// 个人版底部导航
function PersonalTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="地图"
        component={PersonalMapScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="map-marked-alt" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="通讯录"
        component={PersonalContactsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="address-book" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AI预测"
        component={PersonalPredictionScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="brain" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="安全"
        component={PersonalSafetyScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="shield-alt" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="我的"
        component={PersonalProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" size={22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// 企业版底部导航
function EnterpriseTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="首页"
        component={EnterpriseHomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="组织"
        component={EnterpriseOrgScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="sitemap" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="打卡"
        component={EnterpriseCheckInScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="clock" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="客户"
        component={EnterpriseCustomersScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="handshake" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="我的"
        component={EnterpriseProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" size={22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// 政企版底部导航
function GovernmentTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="首页"
        component={GovernmentHomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="组织"
        component={GovernmentOrgScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="sitemap" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="监管"
        component={GovernmentMonitorScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="eye" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="统计"
        component={GovernmentStatisticsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="chart-bar" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="我的"
        component={GovernmentProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" size={22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// 个人版导航栈
function PersonalStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: styles.header,
        headerTintColor: '#fff',
        headerTitleStyle: styles.headerTitle,
        cardStyle: { backgroundColor: '#0f172a' },
      }}
    >
      <Stack.Screen
        name="PersonalMain"
        component={PersonalTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ContactDetail"
        component={ContactDetailScreen}
        options={{ title: '联系人详情' }}
      />
      <Stack.Screen
        name="AddContact"
        component={AddContactScreen}
        options={{ title: '添加联系人' }}
      />
      <Stack.Screen
        name="EditContact"
        component={EditContactScreen}
        options={{ title: '编辑联系人' }}
      />
      <Stack.Screen
        name="NavigationSettings"
        component={NavigationSettingsScreen}
        options={{ title: '默认导航设置' }}
      />
      <Stack.Screen
        name="TagManager"
        component={TagManagerScreen}
        options={{ title: '时空标签管理' }}
      />
      <Stack.Screen
        name="GroupManager"
        component={GroupManagerScreen}
        options={{ title: '分组管理' }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ title: '隐私政策' }}
      />
      <Stack.Screen
        name="UserAgreement"
        component={UserAgreementScreen}
        options={{ title: '用户协议' }}
      />
      <Stack.Screen
        name="SOSAlert"
        component={SOSAlertScreen}
        options={{ 
          title: 'SOS紧急求助',
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Subscription"
        component={SubscriptionScreen}
        options={{ title: '高级订阅' }}
      />
      <Stack.Screen
        name="LifeServices"
        component={LifeServicesScreen}
        options={{ title: '生活服务' }}
      />
      <Stack.Screen
        name="Social"
        component={SocialScreen}
        options={{ title: '时空社交' }}
      />
      <Stack.Screen
        name="ARMode"
        component={ARModeScreen}
        options={{ title: 'AR模式' }}
      />
      <Stack.Screen
        name="TrajectoryAnalysis"
        component={TrajectoryAnalysisScreen}
        options={{ title: '轨迹分析' }}
      />
      <Stack.Screen
        name="AuthorizationLog"
        component={AuthorizationLogScreen}
        options={{ title: '授权日志' }}
      />
      <Stack.Screen
        name="DataExport"
        component={DataExportScreen}
        options={{ title: '数据导入导出' }}
      />
    </Stack.Navigator>
  );
}

// 企业版导航栈
function EnterpriseStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: styles.header,
        headerTintColor: '#fff',
        headerTitleStyle: styles.headerTitle,
        cardStyle: { backgroundColor: '#0f172a' },
      }}
    >
      <Stack.Screen
        name="EnterpriseMain"
        component={EnterpriseTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ContactDetail"
        component={ContactDetailScreen}
        options={{ title: '联系人详情' }}
      />
      <Stack.Screen
        name="AddContact"
        component={AddContactScreen}
        options={{ title: '添加联系人' }}
      />
      <Stack.Screen
        name="EditContact"
        component={EditContactScreen}
        options={{ title: '编辑联系人' }}
      />
      <Stack.Screen
        name="NavigationSettings"
        component={NavigationSettingsScreen}
        options={{ title: '默认导航设置' }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ title: '隐私政策' }}
      />
      <Stack.Screen
        name="UserAgreement"
        component={UserAgreementScreen}
        options={{ title: '用户协议' }}
      />
      <Stack.Screen
        name="FieldTask"
        component={EnterpriseFieldTaskScreen}
        options={{ title: '外勤任务' }}
      />
      <Stack.Screen
        name="DataAnalysis"
        component={EnterpriseDataAnalysisScreen}
        options={{ title: '数据分析' }}
      />
      <Stack.Screen
        name="ERPIntegration"
        component={EnterpriseERPIntegrationScreen}
        options={{ title: 'ERP/CRM对接' }}
      />
    </Stack.Navigator>
  );
}

// 政企版导航栈
function GovernmentStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: styles.header,
        headerTintColor: '#fff',
        headerTitleStyle: styles.headerTitle,
        cardStyle: { backgroundColor: '#0f172a' },
      }}
    >
      <Stack.Screen
        name="GovernmentMain"
        component={GovernmentTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ContactDetail"
        component={ContactDetailScreen}
        options={{ title: '人员详情' }}
      />
      <Stack.Screen
        name="NavigationSettings"
        component={NavigationSettingsScreen}
        options={{ title: '默认导航设置' }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ title: '隐私政策' }}
      />
      <Stack.Screen
        name="UserAgreement"
        component={UserAgreementScreen}
        options={{ title: '用户协议' }}
      />
    </Stack.Navigator>
  );
}

// 主应用组件
function MainApp() {
  const { appMode, privacySettings, savePrivacySettings } = useApp();
  const [showModeSwitch, setShowModeSwitch] = useState(false);
  const [showPrivacyConsent, setShowPrivacyConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查是否需要显示隐私政策同意
    if (!privacySettings.agreedToPrivacyPolicy || !privacySettings.agreedToUserAgreement) {
      setShowPrivacyConsent(true);
    }
    setIsLoading(false);
  }, [privacySettings]);

  const handlePrivacyAgree = async () => {
    await savePrivacySettings({
      ...privacySettings,
      agreedToPrivacyPolicy: true,
      agreedToUserAgreement: true,
    });
    setShowPrivacyConsent(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>正在加载...</Text>
      </View>
    );
  }

  // 根据模式选择导航栈
  const renderNavigator = () => {
    switch (appMode) {
      case 'enterprise':
        return <EnterpriseStack />;
      case 'government':
        return <GovernmentStack />;
      case 'personal':
      default:
        return <PersonalStack />;
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        {renderNavigator()}
      </NavigationContainer>
      
      {/* 模式切换弹窗 */}
      <ModeSwitchModal
        visible={showModeSwitch}
        onClose={() => setShowModeSwitch(false)}
      />
      
      {/* 隐私政策同意弹窗 */}
      <PrivacyConsentModal
        visible={showPrivacyConsent}
        onAgree={handlePrivacyAgree}
        onDecline={() => {
          // 用户不同意则退出应用
          // 在实际应用中这里应该退出应用
          setShowPrivacyConsent(false);
        }}
      />
    </>
  );
}

// 根组件
export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#94a3b8',
  },
  tabBar: {
    backgroundColor: '#0f172a',
    borderTopColor: '#1e293b',
    borderTopWidth: 1,
    height: 70,
    paddingBottom: 10,
    paddingTop: 5,
  },
  tabBarLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  header: {
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 17,
  },
});
