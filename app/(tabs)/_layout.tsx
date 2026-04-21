import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
// Ensure these are coming from lucide-react-native
import { Gavel, Home, Package, ShoppingBag, User } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
  screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: '#FFFFFF',
    tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
    tabBarShowLabel: true,
    tabBarStyle: {
      backgroundColor: '#0A0A0A',
      borderTopColor: 'rgba(255,255,255,0.1)',
      borderTopWidth: 1,
      height: Platform.OS === 'ios' ? 80 : 60,
      paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    },
    tabBarLabelStyle: {
      fontSize: 11,
      marginTop: 4,
    },
  }}
>
  {/* 1. Home - points to home/index.tsx */}
  <Tabs.Screen
    name="home/index"
    options={{
      title: 'Home',
      tabBarIcon: ({ color }) => <Home size={24} color={color} />,
    }}
  />

  {/* 2. Products - points to products/index.tsx */}
  <Tabs.Screen
    name="products/index"
    options={{
      title: 'Products',
      tabBarIcon: ({ color }) => <Package size={24} color={color} />,
    }}
  />

  {/* 3. Auction - points to auction/index.tsx */}
  <Tabs.Screen
    name="auction/index"
    options={{
      title: 'Auction',
      tabBarIcon: ({ color }) => <Gavel size={26} color={color} />,
    }}
  />

  {/* 4. Bag - points to checkout-history/index.tsx */}
  <Tabs.Screen
    name="checkout-history/index"
    options={{
      title: 'Bag',
      tabBarIcon: ({ color }) => <ShoppingBag size={24} color={color} />,
    }}
  />

  {/* 5. Profile - points to profile/index.tsx */}
  <Tabs.Screen
    name="profile/index"
    options={{
      title: 'Profile',
      tabBarIcon: ({ color }) => <User size={24} color={color} />,
    }}
  />
</Tabs>
  );
}