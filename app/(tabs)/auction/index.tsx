import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Auction = {
  id: string;
  title: string;
  currentBid: number;
  timeRemaining: string;
  bids: number;
};

export default function AuctionScreen() {
  const { theme: themeKey } = useTheme();
  const theme = Colors[themeKey as keyof typeof Colors];
  const [auctions] = useState<Auction[]>([
    { id: '1', title: 'Luxury Watch - Rolex', currentBid: 5000, timeRemaining: '2h 45m', bids: 12 },
    { id: '2', title: 'Vintage Camera Collection', currentBid: 800, timeRemaining: '5h 20m', bids: 8 },
    { id: '3', title: 'Antique Painting', currentBid: 3200, timeRemaining: '1d 3h', bids: 15 },
    { id: '4', title: 'Rare Coins Set', currentBid: 1500, timeRemaining: '4h 10m', bids: 9 },
  ]);

  const renderAuction = ({ item }: { item: Auction }) => (
    <TouchableOpacity style={[styles.auctionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={[styles.auctionImage, { backgroundColor: theme.buttonBg }]}>
        <Ionicons name="image-outline" size={50} color={theme.secondaryText} />
      </View>
      <View style={styles.auctionContent}>
        <Text style={[styles.auctionTitle, { color: theme.text }]}>{item.title}</Text>
        <View style={styles.bidInfo}>
          <View>
            <Text style={[styles.label, { color: theme.secondaryText }]}>Current Bid</Text>
            <Text style={[styles.currentBid, { color: theme.text }]}>${item.currentBid}</Text>
          </View>
          <View>
            <Text style={[styles.label, { color: theme.secondaryText }]}>Time Left</Text>
            <Text style={styles.timeRemaining}>{item.timeRemaining}</Text>
          </View>
          <View style={[styles.bidsCount, { backgroundColor: theme.buttonBg }]}>
            <Ionicons name="hammer" size={16} color={theme.text} />
            <Text style={[styles.bidsText, { color: theme.text }]}>{item.bids}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Active Auctions</Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>Place your bids now</Text>
      </View>
      <FlatList
        data={auctions}
        keyExtractor={(item) => item.id}
        renderItem={renderAuction}
        contentContainerStyle={styles.listContainer}
        scrollIndicatorInsets={{ right: 1 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },
  title: { fontSize: 34, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 14 },
  listContainer: { paddingHorizontal: 16, paddingBottom: 32 },
  auctionCard: { borderRadius: 16, overflow: 'hidden', marginBottom: 16, borderWidth: 1 },
  auctionImage: { width: '100%', height: 180, justifyContent: 'center', alignItems: 'center' },
  auctionContent: { padding: 16 },
  auctionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  bidInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  label: { fontSize: 11, marginBottom: 4, textTransform: 'uppercase' },
  currentBid: { fontSize: 18, fontWeight: '800' },
  timeRemaining: { fontSize: 16, fontWeight: '700', color: '#FF6B6B' },
  bidsCount: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  bidsText: { fontSize: 14, fontWeight: '600' },
});