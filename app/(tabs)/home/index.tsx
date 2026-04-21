import Button from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type User = {
  displayName?: string;
  email?: string;
};

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const { theme: themeKey } = useTheme();
  const theme = Colors[themeKey as keyof typeof Colors];

  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem('firebaseUser');
      if (stored) setUser(JSON.parse(stored));
    };
    loadUser();
  }, []);

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('firebaseToken');
    await AsyncStorage.removeItem('firebaseUser');
    router.replace('/(auth)/sign-in');
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>
          Welcome{user?.displayName ? `, ${user.displayName}` : ''}!
        </Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          {user?.email ? `You are signed in as ${user.email}.` : 'You are signed in.'}
        </Text>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Explore Auctions</Text>
          <Text style={[styles.cardText, { color: theme.secondaryText }]}>
            Browse available items, place bids, and win your next purchase.
          </Text>
        </View>
        <Button label="Sign Out" onPress={handleSignOut} variant="secondary" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 34, fontWeight: '800', marginBottom: 12 },
  subtitle: { fontSize: 16, marginBottom: 28, lineHeight: 22 },
  card: { borderRadius: 20, padding: 20, marginBottom: 32 },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  cardText: { fontSize: 14, lineHeight: 20 },
});