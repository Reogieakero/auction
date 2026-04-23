import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'success' | 'error';
  theme: any;
}

const FeedbackModal = ({ visible, onClose, title, message, type, theme }: FeedbackModalProps) => (
  <Modal visible={visible} transparent animationType="fade">
    <Pressable style={styles.modalOverlay} onPress={onClose}>
      <View style={[styles.card, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: type === 'error' ? '#FF3B30' : theme.text }]}>
            {title.toUpperCase()}
          </Text>
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
            {message}
          </Text>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.btn} onPress={onClose}>
            <Text style={[styles.btnText, { color: theme.text }]}>OKAY</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { width: '100%', padding: 24, borderRadius: 0 },
  content: { marginBottom: 24 },
  title: { fontSize: 16, fontWeight: '900', marginBottom: 8, letterSpacing: 1 },
  subtitle: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  btn: { paddingVertical: 8 },
  btnText: { fontSize: 12, fontWeight: '900', letterSpacing: 1 }
});

export default FeedbackModal;