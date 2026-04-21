import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Tabs } from 'expo-router';
import { Gavel, Home, Package, ShoppingBag, User } from 'lucide-react-native';
import React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { theme: themeKey } = useTheme();
  const theme = Colors[themeKey as keyof typeof Colors];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.secondaryText,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: (Platform.OS === 'ios' ? 50 : 60) + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="products/index"
        options={{
          title: 'Products',
          tabBarIcon: ({ color }) => <Package size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="auction/index"
        options={{
          title: 'Auction',
          tabBarIcon: ({ color }) => <Gavel size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="checkout-history/index"
        options={{
          title: 'Bag',
          tabBarIcon: ({ color }) => <ShoppingBag size={24} color={color} />,
        }}
      />
      
      {/* 1. Main Profile Tab */}
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />

      {/* 2. Hide the components folder from the Bottom Bar */}
      <Tabs.Screen
        name="profile/components/UserGrid"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}