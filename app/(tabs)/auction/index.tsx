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
  const [auctions] = useState<Auction[]>([
    { id: '1', title: 'Luxury Watch - Rolex', currentBid: 5000, timeRemaining: '2h 45m', bids: 12 },
    { id: '2', title: 'Vintage Camera Collection', currentBid: 800, timeRemaining: '5h 20m', bids: 8 },
    { id: '3', title: 'Antique Painting', currentBid: 3200, timeRemaining: '1d 3h', bids: 15 },
    { id: '4', title: 'Rare Coins Set', currentBid: 1500, timeRemaining: '4h 10m', bids: 9 },
  ]);

  const renderAuction = ({ item }: { item: Auction }) => (
    <TouchableOpacity style={styles.auctionCard}>
      <View style={styles.auctionImage}>
        <Ionicons name="image-outline" size={50} color="rgba(255,255,255,0.2)" />
      </View>
      <View style={styles.auctionContent}>
        <Text style={styles.auctionTitle}>{item.title}</Text>
        <View style={styles.bidInfo}>
          <View>
            <Text style={styles.label}>Current Bid</Text>
            <Text style={styles.currentBid}>${item.currentBid}</Text>
          </View>
          <View>
            <Text style={styles.label}>Time Left</Text>
            <Text style={styles.timeRemaining}>{item.timeRemaining}</Text>
          </View>
          <View style={styles.bidsCount}>
            <Ionicons name="hammer" size={16} color="#FFFFFF" />
            <Text style={styles.bidsText}>{item.bids}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Active Auctions</Text>
        <Text style={styles.subtitle}>Place your bids now</Text>
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
  auctionCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  auctionImage: {
    width: '100%',
    height: 180,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  auctionContent: {
    padding: 16,
  },
  auctionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  bidInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  currentBid: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  timeRemaining: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  bidsCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bidsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
