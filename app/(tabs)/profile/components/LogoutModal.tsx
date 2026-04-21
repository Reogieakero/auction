import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  theme: any;
}

const LogoutModal = ({ visible, onClose, onConfirm, theme }: LogoutModalProps) => (
  <Modal visible={visible} transparent animationType="fade">
    <Pressable style={styles.modalOverlay} onPress={onClose}>
      <View style={[styles.logoutCard, { backgroundColor: theme.background }]}>
        <View style={styles.logoutContent}>
          <Text style={[styles.logoutTitle, { color: theme.text }]}>Sign Out</Text>
          <Text style={[styles.logoutSubtitle, { color: theme.secondaryText }]}>
            Are you sure you want to log out?
          </Text>
        </View>
        <View style={styles.modalActionRow}>
          <TouchableOpacity style={styles.modalBtn} onPress={onClose}>
            <Text style={[styles.cancelBtnText, { color: theme.secondaryText }]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalBtn} onPress={onConfirm}>
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  logoutCard: { width: '100%', padding: 20, elevation: 10, borderRadius: 16 },
  logoutContent: { marginBottom: 20 },
  logoutTitle: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  logoutSubtitle: { fontSize: 14, fontWeight: '500' },
  modalActionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 24 },
  modalBtn: { paddingVertical: 8, paddingHorizontal: 4 },
  cancelBtnText: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase' },
  logoutBtnText: { fontSize: 13, fontWeight: '800', color: '#FF3B30', textTransform: 'uppercase' }
});

export default LogoutModal;