import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type HistoryItem = {
  id: string;
  itemName: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
};

export default function CheckoutHistoryScreen() {
  const [history] = useState<HistoryItem[]>([
    { id: '1', itemName: 'Vintage Watch', amount: 150, date: 'Mar 15, 2026', status: 'completed' },
    { id: '2', itemName: 'Leather Bag', amount: 200, date: 'Mar 10, 2026', status: 'completed' },
    { id: '3', itemName: 'Camera Lens', amount: 300, date: 'Mar 5, 2026', status: 'pending' },
    { id: '4', itemName: 'Antique Clock', amount: 250, date: 'Feb 28, 2026', status: 'completed' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#FFFFFF';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity style={styles.historyCard}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.itemName}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <View style={styles.rightContent}>
        <Text style={styles.amount}>${item.amount}</Text>
        <View style={{ alignItems: 'center' }}>
          <Ionicons
            name={getStatusIcon(item.status)}
            size={20}
            color={getStatusColor(item.status)}
          />
          <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Checkout History</Text>
        <Text style={styles.subtitle}>Your purchase history</Text>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderHistoryItem}
        contentContainerStyle={styles.listContainer}
        scrollIndicatorInsets={{ right: 1 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  rightContent: {
    alignItems: 'flex-end',
    gap: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  status: {
    fontSize: 10,
    fontWeight: '600',
  },
});
