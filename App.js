import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';

import MapScreen from './src/screens/MapScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import TimelineScreen from './src/screens/TimelineScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ContactDetailScreen from './src/screens/ContactDetailScreen';
import NavigationSettingsScreen from './src/screens/NavigationSettingsScreen';
import CategoryManagerScreen from './src/screens/CategoryManagerScreen';
import AddContactScreen from './src/screens/AddContactScreen';
import BackupScreen from './src/screens/BackupScreen';
import ContactSyncScreen from './src/screens/ContactSyncScreen';
import LocationShareScreen from './src/screens/LocationShareScreen';
import NotificationSettingsScreen from './src/screens/NotificationSettingsScreen';
import SOSSettingsScreen from './src/screens/SOSSettingsScreen';
import EditContactScreen from './src/screens/EditContactScreen';

import { AppProvider, useApp } from './src/context/AppContext';
import { LocationShareProvider } from './src/context/LocationShareContext';
import AutoImportManager from './src/components/AutoImportManager';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 自动导入管理器包装组件
function AutoImportWrapper() {
  const { contacts, addContacts, loaded } = useApp();
  return <AutoImportManager contacts={contacts} addContacts={addContacts} loaded={loaded} />;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: '#0f172a', borderTopColor: '#334155', height: 70, paddingBottom: 10 },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: { fontSize: 11, marginTop: 4 },
        headerShown: false,
      }}
    >
      <Tab.Screen name="地图" component={MapScreen} options={{ tabBarIcon: ({ color }) => <Icon name="map-marked-alt" size={22} color={color} /> }} />
      <Tab.Screen name="分类" component={CategoryScreen} options={{ tabBarIcon: ({ color }) => <Icon name="th-large" size={22} color={color} /> }} />
      <Tab.Screen name="时空" component={TimelineScreen} options={{ tabBarIcon: ({ color }) => <Icon name="history" size={22} color={color} /> }} />
      <Tab.Screen name="我的" component={ProfileScreen} options={{ tabBarIcon: ({ color }) => <Icon name="user" size={22} color={color} /> }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AppProvider>
      <LocationShareProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <AutoImportWrapper />
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: '#0f172a' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
              cardStyle: { backgroundColor: '#0f172a' },
            }}
          >
            <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="ContactDetail" component={ContactDetailScreen} options={{ title: '联系人详情' }} />
            <Stack.Screen name="NavigationSettings" component={NavigationSettingsScreen} options={{ title: '默认导航设置' }} />
            <Stack.Screen name="CategoryManager" component={CategoryManagerScreen} options={{ title: '分类管理' }} />
            <Stack.Screen name="AddContact" component={AddContactScreen} options={{ title: '添加联系人' }} />
            <Stack.Screen name="Backup" component={BackupScreen} options={{ title: '数据备份' }} />
            <Stack.Screen name="ContactSync" component={ContactSyncScreen} options={{ title: '联系人同步' }} />
            <Stack.Screen name="LocationShare" component={LocationShareScreen} options={{ title: '位置共享' }} />
            <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{ title: '消息通知' }} />
            <Stack.Screen name="SOSSettings" component={SOSSettingsScreen} options={{ title: 'SOS紧急联系人' }} />
            <Stack.Screen name="EditContact" component={EditContactScreen} options={{ title: '编辑联系人' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </LocationShareProvider>
    </AppProvider>
  );
}
