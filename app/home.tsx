import Button from '@/components/ui/Button';
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

  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem('firebaseUser');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    };

    loadUser();
  }, []);

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('firebaseToken');
    await AsyncStorage.removeItem('firebaseUser');
    router.replace('/(auth)/sign-in');
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome{user?.displayName ? `, ${user.displayName}` : ''}!</Text>
        <Text style={styles.subtitle}>
          {user?.email ? `You are signed in as ${user.email}.` : 'You are signed in.'}
        </Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Explore Auctions</Text>
          <Text style={styles.cardText}>
            Browse available items, place bids, and win your next purchase.
          </Text>
        </View>
        <Button label="Sign Out" onPress={handleSignOut} variant="secondary" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 28,
    lineHeight: 22,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 20,
  },
});
