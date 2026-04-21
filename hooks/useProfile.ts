import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

export const useProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const { theme: themeKey, toggleTheme } = useTheme();
  const theme = Colors[themeKey as keyof typeof Colors] || Colors.light;

  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem('firebaseUser');
      if (stored) setUser(JSON.parse(stored));
    };
    loadUser();
  }, []);

  const confirmLogout = async () => {
    try {
      setLogoutVisible(false);
      await AsyncStorage.removeItem('firebaseUser');
      router.replace('/(auth)/sign-in');
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenShop = () => {
    router.push('/profile/open-shop');
  };

  const ringColor = themeKey === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
  const blobColor = themeKey === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)';

  return {
    user,
    theme,
    themeKey,
    toggleTheme,
    logoutVisible,
    setLogoutVisible,
    confirmLogout,
    handleOpenShop,
    ringColor,
    blobColor,
  };
};