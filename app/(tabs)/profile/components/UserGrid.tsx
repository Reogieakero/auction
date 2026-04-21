import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const columnWidth = (width - 2) / 3;

export default function UserGrid({ theme = {} as any }) {
  const [activeTab, setActiveTab] = useState('grid');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const pulseAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.6, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  const items = [
    { id: 1, isLive: true, title: 'Vintage Rolex Daytona', currentBid: '$42,000', owner: 'Alex Rivera', imageUrl: 'https://images.unsplash.com/photo-1549497538-303791108f94?q=80&w=400' },
    { id: 2, isLive: false, title: 'Limited Edition Sneakers', soldPrice: '$1,200', owner: 'Jordan Smith', imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=400' },
    { id: 3, isLive: true, title: 'Cyberpunk Art NFT', currentBid: '2.5 ETH', owner: 'Neon Artist', imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=400' },
    { id: 4, isLive: false, title: 'Classic Leica Camera', soldPrice: '$3,850', owner: 'S. Miller', imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=400' },
  ];

  const safeBg = theme?.background || '#FFFFFF';
  const safeText = theme?.text || '#000000';
  const safeSecText = theme?.secondaryText || '#666666';
  const safeCard = theme?.card || '#F5F5F5';
  
  // Dynamic Background Style (Adapts to Light/Dark)
  const ringColor = safeText + '08'; // very subtle 8% opacity of text color
  const blobColor = safeText + '04'; // even subtler 4%

  return (
    <View style={[styles.container, { backgroundColor: safeBg }]}>
      {/* Background Decor Elements */}
      <View style={[styles.ring1, { borderColor: ringColor }]} pointerEvents="none" />
      <View style={[styles.blob, { backgroundColor: blobColor }]} pointerEvents="none" />

      {/* Tab Bar */}
      <View style={[styles.tabBar, { borderTopWidth: 0.5, borderTopColor: safeText + '15' }]}>
        <TouchableOpacity onPress={() => setActiveTab('grid')} style={[styles.tab, activeTab === 'grid' && { borderBottomWidth: 1.5, borderBottomColor: safeText }]}>
          <Ionicons name="grid-outline" size={20} color={activeTab === 'grid' ? safeText : safeSecText} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('tagged')} style={[styles.tab, activeTab === 'tagged' && { borderBottomWidth: 1.5, borderBottomColor: safeText }]}>
          <Ionicons name="bookmark-outline" size={20} color={activeTab === 'tagged' ? safeText : safeSecText} />
        </TouchableOpacity>
      </View>

      {/* Grid Content */}
      <View style={styles.gridContainer}>
        {items.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.gridItem, { backgroundColor: safeCard }]}
            onPress={() => setSelectedItem(item)}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            {item.isLive && (
              <Animated.View style={[styles.liveBadge, { opacity: pulseAnim }]}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </Animated.View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal - Also contains decorative background */}
      <Modal visible={!!selectedItem} transparent animationType="fade" onRequestClose={() => setSelectedItem(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedItem(null)}>
          <View style={[styles.centeredCard, { backgroundColor: safeBg }]}>
             {/* Decorative ring inside modal for consistency */}
             <View style={[styles.ringModal, { borderColor: ringColor }]} pointerEvents="none" />
            
            {selectedItem && (
              <View style={styles.cardInner}>
                <View style={styles.ownerHeader}>
                  <View style={[styles.smallAvatar, { backgroundColor: safeCard }]}>
                    <Ionicons name="person" size={14} color={safeText} />
                  </View>
                  <Text style={[styles.ownerName, { color: safeText }]}>{selectedItem.owner}</Text>
                  <TouchableOpacity onPress={() => setSelectedItem(null)} style={styles.closeBtn}>
                    <Ionicons name="close-circle" size={24} color={safeText + '80'} />
                  </TouchableOpacity>
                </View>

                <Image source={{ uri: selectedItem.imageUrl }} style={styles.cardImage} />

                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, { color: safeText }]} numberOfLines={1}>
                    {selectedItem.title}
                  </Text>
                  
                  <View style={styles.footerRow}>
                    <View>
                      <Text style={[styles.priceLabel, { color: safeSecText }]}>
                        {selectedItem.isLive ? 'Current Bid' : 'Price Bought'}
                      </Text>
                      <Text style={[styles.priceValue, { color: safeText }]}>
                        {selectedItem.isLive ? selectedItem.currentBid : selectedItem.soldPrice}
                      </Text>
                    </View>

                    <TouchableOpacity 
                      style={[styles.smallActionBtn, { backgroundColor: safeText }]}
                      onPress={() => setSelectedItem(null)}
                    >
                      <Text style={[styles.actionButtonText, { color: safeBg }]}>View</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10, position: 'relative', overflow: 'hidden' },
  // Decorative Background Styles
  ring1: { position: 'absolute', width: 300, height: 300, borderRadius: 150, borderWidth: 1, top: -50, right: -100, zIndex: 0 },
  blob: { position: 'absolute', width: 200, height: 200, borderRadius: 100, bottom: -20, left: -50, zIndex: 0 },
  ringModal: { position: 'absolute', width: 200, height: 200, borderRadius: 100, borderWidth: 1, bottom: -50, right: -50 },

  tabBar: { flexDirection: 'row', height: 48, zIndex: 1 },
  tab: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 1, zIndex: 1 },
  gridItem: { width: columnWidth, height: columnWidth },
  image: { width: '100%', height: '100%' },
  liveBadge: { position: 'absolute', top: 6, right: 6, backgroundColor: '#FF3B30', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, flexDirection: 'row', alignItems: 'center' },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF', marginRight: 4 },
  liveText: { color: '#FFF', fontSize: 8, fontWeight: '900' },

  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.85)', 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 16 
  },
  centeredCard: { 
    width: '100%', 
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
    position: 'relative'
  },
  cardInner: { width: '100%', zIndex: 1 },
  ownerHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8 },
  smallAvatar: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  ownerName: { fontSize: 13, fontWeight: '700', flex: 1 },
  closeBtn: { padding: 4 },
  cardImage: { width: '100%', height: width - 32, resizeMode: 'cover' },
  cardContent: { padding: 16 },
  cardTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  footerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(150,150,150,0.15)'
  },
  priceLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  priceValue: { fontSize: 18, fontWeight: '800' },
  smallActionBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  actionButtonText: { fontSize: 14, fontWeight: '700' }
});