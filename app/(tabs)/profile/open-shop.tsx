import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OpenShopScreen() {
  const router = useRouter();
  const { theme: themeKey } = useTheme();
  const theme = Colors[themeKey as keyof typeof Colors] || Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Open Shop</Text>
      </View>
      
      <View style={styles.content}>
        <Ionicons name="storefront" size={80} color={theme.text} style={{ opacity: 0.1, marginBottom: 20 }} />
        <Text style={[styles.message, { color: theme.secondaryText }]}>
          Start your journey as a seller in the Vault.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingTop: 60, 
    paddingHorizontal: 20, 
    gap: 16 
  },
  backBtn: { padding: 8, marginLeft: -8 },
  title: { fontSize: 20, fontWeight: '800' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  message: { fontSize: 16, textAlign: 'center', fontWeight: '500' }
});