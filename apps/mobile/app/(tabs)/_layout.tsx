import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Compass, PlusCircle, Users, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#191919',
        tabBarInactiveTintColor: '#8A8176',
        tabBarStyle: {
          backgroundColor: '#F7F5F0',
          borderTopColor: '#EAE8E3',
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: '#F7F5F0',
          borderBottomColor: '#EAE8E3',
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 22,
          color: '#191919',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'DROBE',
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarLabel: 'Trends',
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Publish Look',
          tabBarLabel: 'Create',
          tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="stylists"
        options={{
          title: 'Stylists',
          tabBarLabel: 'Stylists',
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
