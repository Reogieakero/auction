import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../constants/firebaseConfig';

export const useProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [profileData, setProfileData] = useState({
    displayName: '',
    gender: '',
    birthday: '',
  });
  const [logoutVisible, setLogoutVisible] = useState(false);
  const { theme: themeKey, toggleTheme } = useTheme();
  const theme = Colors[themeKey as keyof typeof Colors] || Colors.light;

  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem('firebaseUser');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setProfileData(prev => ({ ...prev, displayName: parsed.email || 'VIP Collector' }));
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfileData({
          displayName: data.displayName || user.email || 'VIP Collector',
          gender: data.gender || '',
          birthday: data.birthday || '',
        });
      }
    });
    return () => unsubscribe();
  }, [user]);

  const confirmLogout = async () => {
    try {
      setLogoutVisible(false);
      await AsyncStorage.removeItem('firebaseUser');
      router.replace('/(auth)/sign-in');
    } catch (e) { console.error(e); }
  };

  const handleOpenShop = () => router.push('/profile/open-shop');

  return {
    user,
    profileData,
    theme,
    themeKey,
    toggleTheme,
    logoutVisible,
    setLogoutVisible,
    confirmLogout,
    handleOpenShop,
    ringColor: themeKey === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
    blobColor: themeKey === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
  };
};