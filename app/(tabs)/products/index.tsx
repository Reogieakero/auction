import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
};

export default function ProductsScreen() {
  const { theme: themeKey } = useTheme();
  const theme = Colors[themeKey as keyof typeof Colors];
  const [products] = useState<Product[]>([
    { id: '1', name: 'Vintage Watch', price: 150, category: 'Accessories' },
    { id: '2', name: 'Leather Bag', price: 200, category: 'Fashion' },
    { id: '3', name: 'Camera Lens', price: 300, category: 'Electronics' },
    { id: '4', name: 'Antique Clock', price: 250, category: 'Collectibles' },
  ]);

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={[styles.productCard, { backgroundColor: theme.card }]}>
      <View style={[styles.productImage, { backgroundColor: theme.buttonBg }]}>
        <Ionicons name="image-outline" size={40} color={theme.secondaryText} />
      </View>
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.productCategory, { color: theme.secondaryText }]}>{item.category}</Text>
        <Text style={[styles.productPrice, { color: theme.text }]}>${item.price}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={theme.secondaryText} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Products</Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>Browse all available products</Text>
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
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
  productCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, marginBottom: 12 },
  productImage: { width: 80, height: 80, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  productInfo: { flex: 1 },
  productName: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  productCategory: { fontSize: 12, marginBottom: 8 },
  productPrice: { fontSize: 14, fontWeight: '600' },
});