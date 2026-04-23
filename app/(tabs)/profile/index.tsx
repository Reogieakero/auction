import { Ionicons } from '@expo/vector-icons';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProfile } from '@/hooks/useProfile';
import { db } from '../../../constants/firebaseConfig';
import EditProfileModal from './components/EditProfileModal';
import FeedbackModal from './components/FeedbackModal';
import LogoutModal from './components/LogoutModal';
import UserGrid from './components/UserGrid';

export default function ProfileScreen() {
  const { 
    user, profileData, theme, themeKey, toggleTheme, 
    logoutVisible, setLogoutVisible, confirmLogout, 
    handleOpenShop, ringColor, blobColor 
  } = useProfile();

  const [editVisible, setEditVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'success' as 'success' | 'error'
  });

  const getGenderIcon = (gender: string) => {
    switch (gender?.toLowerCase()) {
      case 'male': return 'male';
      case 'female': return 'female';
      default: return 'transgender';
    }
  };

  const handleSaveToFirestore = async (newData: any) => {
    if (!user?.uid) {
      setAlertConfig({ visible: true, title: "Error", message: "Sign in to save changes.", type: 'error' });
      return;
    }
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, newData, { merge: true });
      setAlertConfig({ visible: true, title: "Success", message: "Your profile has been updated.", type: 'success' });
      setEditVisible(false);
    } catch (error: any) {
      setAlertConfig({ visible: true, title: "Update Failed", message: "Connection error.", type: 'error' });
    }
  };

  const StatItem = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.secondaryText }]}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar barStyle={themeKey === 'dark' ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
      
      <View style={[styles.ring1, { borderColor: ringColor }]} pointerEvents="none" />
      <View style={[styles.ring2, { borderColor: ringColor }]} pointerEvents="none" />
      <View style={[styles.blob, { backgroundColor: blobColor }]} pointerEvents="none" />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.contentLayer}>
        <View style={styles.topNav}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
          <View style={styles.topIcons}>
            <TouchableOpacity onPress={toggleTheme} style={styles.iconBtn}>
              <Ionicons name={themeKey === 'dark' ? "sunny-outline" : "moon-outline"} size={24} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setLogoutVisible(true)} style={[styles.iconBtn, { marginLeft: 16 }]}>
              <Ionicons name="log-out-outline" size={24} color="#FF3B30" /> 
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.headerSection}>
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatarBorder, { borderColor: theme.text + '20' }]}>
               <View style={[styles.avatar, { backgroundColor: theme.card }]}>
                  <Ionicons name="person" size={42} color={theme.text} />
               </View>
            </View>
          </View>
          <View style={styles.infoWrapper}>
            <View style={styles.nameRow}>
              <Text style={[styles.displayName, { color: theme.text }]}>
                {profileData.displayName}
              </Text>
              <Ionicons 
                name={getGenderIcon(profileData.gender)} 
                size={18} 
                color={theme.secondaryText} 
                style={styles.genderIcon}
              />
            </View>
            <View style={styles.statsRow}>
              <StatItem label="Won" value="12" />
              <StatItem label="Bids" value="48" />
              <StatItem label="Rank" value="#4" />
            </View>
          </View>
        </View>

        <View style={styles.bioSection}>
          <Text style={[styles.bioText, { color: theme.secondaryText }]}>
            {(profileData as any).bio || "Add a bio to let others know about you."}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={[styles.mainActionBtn, { backgroundColor: theme.text }]}
            onPress={() => setEditVisible(true)}
          >
            <Text style={[styles.mainActionText, { color: theme.background }]}>Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.secondaryActionBtn, { borderColor: theme.text + '30' }]}
            onPress={handleOpenShop}
          >
            <Ionicons name="storefront-outline" size={20} color={theme.text} />
          </TouchableOpacity>
        </View>

        <UserGrid theme={theme} />
      </ScrollView>

      <FeedbackModal 
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        theme={theme}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
      />

      <EditProfileModal 
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        initialData={profileData}
        onSave={handleSaveToFirestore}
        theme={theme}
      />

      <LogoutModal 
        visible={logoutVisible} 
        theme={theme} 
        onClose={() => setLogoutVisible(false)} 
        onConfirm={confirmLogout} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, position: 'relative', overflow: 'hidden' },
  contentLayer: { flex: 1, zIndex: 1 },
  ring1: { position: 'absolute', width: 320, height: 320, borderRadius: 160, borderWidth: 1, top: -80, left: -80, zIndex: 0 },
  ring2: { position: 'absolute', width: 260, height: 260, borderRadius: 130, borderWidth: 1, bottom: 100, right: -60, zIndex: 0 },
  blob: { position: 'absolute', width: 140, height: 140, borderRadius: 70, top: 260, left: -30, zIndex: 0 },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, height: 60 },
  headerTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  topIcons: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: 4 },
  headerSection: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginTop: 10 },
  avatarWrapper: { marginRight: 20 },
  avatarBorder: { width: 90, height: 90, borderRadius: 45, borderWidth: 1, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed' },
  avatar: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
  infoWrapper: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 6 },
  displayName: { fontSize: 20, fontWeight: '700' },
  genderIcon: { opacity: 0.6 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { alignItems: 'flex-start' },
  statValue: { fontSize: 16, fontWeight: '700' },
  statLabel: { fontSize: 12, marginTop: 2, opacity: 0.7 },
  bioSection: { paddingHorizontal: 20, marginTop: 20 },
  bioText: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
  actionRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginTop: 25, marginBottom: 20 },
  mainActionBtn: { flex: 1, height: 46, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  mainActionText: { fontWeight: '700', fontSize: 15 },
  secondaryActionBtn: { width: 46, height: 46, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
});