import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform, ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData: {
    displayName: string;
    gender: string;
    birthday: string;
  };
  theme: any;
}

export default function EditProfileModal({ visible, onClose, onSave, initialData, theme }: EditProfileModalProps) {
  const [formData, setFormData] = useState(initialData);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(formData);
    setSaving(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={[styles.modalContent, { backgroundColor: theme.background }]}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: theme.secondaryText }}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.text }]}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator size="small" color={theme.text} /> : 
              <Text style={[styles.saveText, { color: theme.text }]}>Done</Text>}
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.secondaryText }]}>FULL NAME</Text>
              <TextInput 
                style={[styles.input, { color: theme.text, backgroundColor: theme.card }]}
                value={formData.displayName}
                onChangeText={(t) => setFormData({...formData, displayName: t})}
                placeholder="Enter your name"
                placeholderTextColor={theme.secondaryText + '80'}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.secondaryText }]}>GENDER</Text>
              <TextInput 
                style={[styles.input, { color: theme.text, backgroundColor: theme.card }]}
                value={formData.gender}
                onChangeText={(t) => setFormData({...formData, gender: t})}
                placeholder="Male / Female / Other"
                placeholderTextColor={theme.secondaryText + '80'}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.secondaryText }]}>BIRTHDAY</Text>
              <TextInput 
                style={[styles.input, { color: theme.text, backgroundColor: theme.card }]}
                value={formData.birthday}
                onChangeText={(t) => setFormData({...formData, birthday: t})}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.secondaryText + '80'}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 30, borderTopRightRadius: 30, height: '85%', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 18, fontWeight: '800' },
  saveText: { fontWeight: '700' },
  form: { flex: 1 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
  input: { height: 55, borderRadius: 15, paddingHorizontal: 16, fontSize: 16, fontWeight: '500' }
});