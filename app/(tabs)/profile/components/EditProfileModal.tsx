import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
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
    bio?: string;
  };
  theme: any;
}

export default function EditProfileModal({ visible, onClose, onSave, initialData, theme }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    displayName: initialData.displayName || '',
    gender: initialData.gender || 'Other',
    birthday: initialData.birthday || '',
    bio: initialData.bio || ''
  });
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setFormData({
        displayName: initialData.displayName || '',
        gender: initialData.gender || 'Other',
        birthday: initialData.birthday || '',
        bio: initialData.bio || ''
      });
    }
  }, [visible, initialData]);

  const isInvalid = formData.bio.length > 40;

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString('en-US');
      setFormData({ ...formData, birthday: formattedDate });
    }
  };

  const handleSave = async () => {
    if (isInvalid) return; 
    setSaving(true);
    await onSave(formData);
    setSaving(false);
    onClose();
  };

  const genders = ['Male', 'Female', 'Other'];

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
          style={styles.keyboardAvoiding}
        >
          <Pressable style={[styles.centeredCard, { backgroundColor: theme.background }]} onPress={e => e.stopPropagation()}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.text }]}>EDIT PROFILE</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={26} color={theme.text} />
              </TouchableOpacity>
            </View>

            {/* FORM CONTAINER (No ScrollView) */}
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.secondaryText }]}>PUBLIC NAME</Text>
                <TextInput 
                  style={[styles.input, { color: theme.text, backgroundColor: theme.card }]}
                  value={formData.displayName}
                  onChangeText={(t) => setFormData({...formData, displayName: t})}
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={[styles.label, { color: theme.secondaryText }]}>ABOUT YOU</Text>
                  <Text style={[styles.charCount, { color: isInvalid ? '#FF3B30' : theme.secondaryText }]}>
                    {formData.bio.length}/40
                  </Text>
                </View>
                <TextInput 
                  style={[styles.input, styles.textArea, { 
                    color: theme.text, 
                    backgroundColor: theme.card,
                    borderColor: isInvalid ? '#FF3B30' : 'transparent',
                    borderWidth: isInvalid ? 1 : 0
                  }]}
                  value={formData.bio}
                  multiline
                  numberOfLines={2}
                  onChangeText={(t) => setFormData({...formData, bio: t})}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.secondaryText }]}>BIRTHDATE</Text>
                <TouchableOpacity 
                  style={[styles.input, { backgroundColor: theme.card, justifyContent: 'center' }]}
                  onPress={() => setShowPicker(true)}
                >
                  <Text style={{ color: formData.birthday ? theme.text : theme.secondaryText + '70' }}>
                    {formData.birthday || "Select Date"}
                  </Text>
                </TouchableOpacity>

                {showPicker && (
                  <DateTimePicker
                    value={formData.birthday ? new Date(formData.birthday) : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                    maximumDate={new Date()}
                  />
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.secondaryText }]}>GENDER</Text>
                <View style={styles.genderRow}>
                  {genders.map((g) => (
                    <TouchableOpacity 
                      key={g}
                      onPress={() => setFormData({...formData, gender: g})}
                      style={[
                        styles.genderBtn, 
                        { backgroundColor: theme.card, borderRadius: 0 },
                        formData.gender === g && { backgroundColor: theme.text }
                      ]}
                    >
                      <Text style={{ 
                        color: formData.gender === g ? theme.background : theme.text,
                        fontWeight: '900',
                        fontSize: 11
                      }}>{g.toUpperCase()}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.saveBtn, { backgroundColor: isInvalid ? theme.card : theme.text, borderRadius: 0 }]} 
                onPress={handleSave}
                disabled={saving || isInvalid}
              >
                {saving ? <ActivityIndicator color={theme.background} /> : 
                <Text style={[styles.saveBtnText, { color: isInvalid ? theme.secondaryText : theme.background }]}>
                    {isInvalid ? "TOO LONG" : "SAVE CHANGES"}
                </Text>}
              </TouchableOpacity>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  keyboardAvoiding: { width: '100%', alignItems: 'center' },
  centeredCard: { width: '100%', padding: 24, borderRadius: 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  formContainer: { width: '100%' },
  inputGroup: { marginBottom: 16 }, // Uniform spacing between sections
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  label: { fontSize: 9, fontWeight: '900', letterSpacing: 2, marginBottom: 8 }, // Uniform spacing from label to box
  charCount: { fontSize: 9, fontWeight: '900' },
  input: { height: 50, paddingHorizontal: 16, fontSize: 13, borderRadius: 0 },
  textArea: { height: 60, paddingTop: 12, textAlignVertical: 'top' },
  genderRow: { flexDirection: 'row', gap: 2 },
  genderBtn: { flex: 1, height: 45, justifyContent: 'center', alignItems: 'center' },
  saveBtn: { height: 55, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  saveBtnText: { fontSize: 13, fontWeight: '900', letterSpacing: 2 }
});