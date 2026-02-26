import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';

// Screens
import MapScreen from './src/screens/MapScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import TimelineScreen from './src/screens/TimelineScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ContactDetailScreen from './src/screens/ContactDetailScreen';
import NavigationSettingsScreen from './src/screens/NavigationSettingsScreen';
import CategoryManagerScreen from './src/screens/CategoryManagerScreen';
import AddContactScreen from './src/screens/AddContactScreen';

// Context
import { AppProvider } from './src/context/AppContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopColor: '#334155',
          height: 70,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 4,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="地图"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="map-marked-alt" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="分类"
        component={CategoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="th-large" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="时空"
        component={TimelineScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="history" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="我的"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" size={22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0f172a',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            cardStyle: {
              backgroundColor: '#0f172a',
            },
          }}
        >
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ContactDetail"
            component={ContactDetailScreen}
            options={{ title: '联系人详情' }}
          />
          <Stack.Screen
            name="NavigationSettings"
            component={NavigationSettingsScreen}
            options={{ title: '默认导航设置' }}
          />
          <Stack.Screen
            name="CategoryManager"
            component={CategoryManagerScreen}
            options={{ title: '分类管理' }}
          />
          <Stack.Screen
            name="AddContact"
            component={AddContactScreen}
            options={{ title: '添加联系人' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
