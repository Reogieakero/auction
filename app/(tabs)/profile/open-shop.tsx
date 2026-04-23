import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { useProfile } from '@/hooks/useProfile';

const CATEGORIES = ["Digital Assets", "Physical Rarities", "Trading Cards", "Art", "Electronics", "Collectibles"];

export default function OpenShopScreen() {
  const router = useRouter();
  const { theme, profileData, ringColor, blobColor } = useProfile();

  const [formData, setFormData] = useState({
    shopName: '',
    selectedCategories: [] as string[],
    termsAccepted: false,
  });
  
  const [showTerms, setShowTerms] = useState(false);

  const isOldEnough = useMemo(() => {
    if (!profileData.birthday) return false;
    const birthDate = new Date(profileData.birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 15;
  }, [profileData.birthday]);

  const toggleCategory = (cat: string) => {
    setFormData(prev => {
      const exists = prev.selectedCategories.includes(cat);
      if (exists) return { ...prev, selectedCategories: prev.selectedCategories.filter(c => c !== cat) };
      if (prev.selectedCategories.length < 3) return { ...prev, selectedCategories: [...prev.selectedCategories, cat] };
      return prev;
    });
  };

  const isFormValid = formData.shopName.length > 3 && formData.selectedCategories.length > 0 && isOldEnough && formData.termsAccepted;

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* Background Decor */}
      <View style={[styles.ring1, { borderColor: ringColor }]} pointerEvents="none" />
      <View style={[styles.blob, { backgroundColor: blobColor }]} pointerEvents="none" />

      <View style={styles.headerNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={26} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>BECOME A SELLER</Text>
        <View style={{ width: 40 }} /> 
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <Text style={[styles.heroTitle, { color: theme.text }]}>The Vault Marketplace</Text>
          <Text style={[styles.heroSubtitle, { color: theme.secondaryText }]}>
            Merchant Application
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.secondaryText }]}>SHOP NAME</Text>
            <TextInput 
              style={[styles.input, { color: theme.text, backgroundColor: theme.card }]}
              placeholder="Shop name..."
              placeholderTextColor={theme.secondaryText + '50'}
              value={formData.shopName}
              onChangeText={(t) => setFormData({...formData, shopName: t})}
            />
          </View>

          <Text style={[styles.label, { color: theme.secondaryText, marginBottom: 12 }]}>CATEGORIES (STRICT SQUARE)</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => {
              const isSelected = formData.selectedCategories.includes(cat);
              return (
                <TouchableOpacity 
                  key={cat}
                  onPress={() => toggleCategory(cat)}
                  style={[
                    styles.squareChip, 
                    { backgroundColor: isSelected ? theme.text : theme.card, borderColor: theme.text + '20' }
                  ]}
                >
                  <Text style={[styles.chipText, { color: isSelected ? theme.background : theme.text }]}>
                    {cat.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.complianceBox}>
            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.switchLabel, { color: theme.text }]}>Age Verification</Text>
                <Text style={[styles.switchSub, { color: isOldEnough ? "#4CD964" : "#FF3B30" }]}>
                  {isOldEnough ? "Verified (15+)" : "Update birthdate in profile"}
                </Text>
              </View>
              <Ionicons name={isOldEnough ? "checkmark-circle" : "alert-circle"} size={24} color={isOldEnough ? "#4CD964" : "#FF3B30"} />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.text + '10' }]} />

            <View style={styles.switchRow}>
              <TouchableOpacity onPress={() => setShowTerms(true)} style={{ flex: 1 }}>
                <Text style={[styles.switchLabel, { color: theme.text, textDecorationLine: 'underline' }]}>Terms & Privacy</Text>
                <Text style={[styles.switchSub, { color: theme.secondaryText }]}>Tap to read</Text>
              </TouchableOpacity>
              <Switch 
                value={formData.termsAccepted} 
                onValueChange={(v) => setFormData({...formData, termsAccepted: v})}
                trackColor={{ false: theme.card, true: theme.text }}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.submitBtn, { backgroundColor: isFormValid ? theme.text : theme.card }]}
            onPress={() => Alert.alert("Success", "Request Sent")}
            disabled={!isFormValid}
          >
            <Text style={[styles.submitBtnText, { color: isFormValid ? theme.background : theme.secondaryText }]}>SUBMIT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* FIXED TERMS OVERLAY: No background bleeding */}
      <Modal 
        visible={showTerms} 
        animationType="fade" 
        transparent={true}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Seller Policy</Text>
              <TouchableOpacity onPress={() => setShowTerms(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={true} style={styles.modalBody}>
              <Text style={[styles.termsText, { color: theme.secondaryText }]}>
                1. Account Safety: You are responsible for maintaining the security of your merchant account.
                {"\n\n"}
                2. Listing Integrity: All items must match their descriptions perfectly. No misleading photos.
                {"\n\n"}
                3. Fees: A standard transaction fee applies to all successful sales.
                {"\n\n"}
                4. Conduct: Harassment or fraudulent bidding will result in an immediate ban.
                {"\n\n"}
                5. Age: Sellers must be at least 15 years old as verified by profile data.
              </Text>
            </ScrollView>

            <TouchableOpacity 
              style={[styles.modalActionBtn, { backgroundColor: theme.text }]}
              onPress={() => setShowTerms(false)}
            >
              <Text style={[styles.modalActionText, { color: theme.background }]}>ACCEPT & CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, position: 'relative' },
  ring1: { position: 'absolute', width: 320, height: 320, borderRadius: 160, borderWidth: 1, top: -80, left: -80 },
  blob: { position: 'absolute', width: 140, height: 140, borderRadius: 70, top: 260, left: -30 },
  headerNav: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, height: 110 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 14, fontWeight: '900', letterSpacing: 2, textAlign: 'center', flex: 1 },
  scrollContent: { paddingBottom: 40 },
  heroSection: { alignItems: 'center', padding: 30 },
  heroTitle: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
  heroSubtitle: { fontSize: 14, textAlign: 'center', fontWeight: '500' },
  formContainer: { paddingHorizontal: 20 },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  input: { height: 50, borderRadius: 12, paddingHorizontal: 15, marginTop: 10, fontWeight: '600' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 30 },
  squareChip: { paddingHorizontal: 10, paddingVertical: 12, borderWidth: 1, minWidth: '31.5%', alignItems: 'center', borderRadius: 0 },
  chipText: { fontSize: 10, fontWeight: '900' },
  complianceBox: { padding: 20, borderRadius: 20, backgroundColor: 'rgba(128,128,128,0.05)', marginBottom: 30 },
  switchRow: { flexDirection: 'row', alignItems: 'center' },
  switchLabel: { fontSize: 15, fontWeight: '700' },
  switchSub: { fontSize: 12 },
  divider: { height: 1, marginVertical: 15 },
  submitBtn: { height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  submitBtnText: { fontSize: 15, fontWeight: '800' },
  
  // MODAL FIXES: High opacity and solid background to prevent "scrambling"
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.85)', // Darker overlay to hide background noise
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  modalContent: { 
    width: '100%', 
    borderRadius: 28, 
    padding: 24, 
    maxHeight: '75%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 13,
    elevation: 20 // Shadow for Android to separate layers
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '900' },
  modalCloseBtn: { padding: 4 },
  modalBody: { marginBottom: 25 },
  termsText: { fontSize: 14, lineHeight: 22, fontWeight: '500' },
  modalActionBtn: { height: 55, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  modalActionText: { fontWeight: '800', fontSize: 14, letterSpacing: 1 }
});