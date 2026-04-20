import { AnimatedInput } from '@/components/ui/AnimatedInput';
import { auth } from '@/constants/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const fadeTitle = useRef(new Animated.Value(0)).current;
  const slideTitle = useRef(new Animated.Value(24)).current;
  const fadeForm = useRef(new Animated.Value(0)).current;
  const slideForm = useRef(new Animated.Value(32)).current;
  const fadeFooter = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeTitle, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slideTitle, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeForm, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(slideForm, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
      ]),
      Animated.timing(fadeFooter, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [fadeTitle, slideTitle, fadeForm, slideForm, fadeFooter]);

  const animateButton = (toValue: number) => {
    Animated.spring(btnScale, {
      toValue,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const firebaseToken = await user.getIdToken();

      await AsyncStorage.setItem('firebaseToken', firebaseToken);
      await AsyncStorage.setItem('firebaseUser', JSON.stringify({
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email || '',
      }));

      console.log('Sign-in successful. Redirecting to home...');
      setLoading(false);
      router.replace('/home');
    } catch (error: any) {
      console.error('Sign-in error:', error);
      let errorMessage = 'Sign-in failed';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Email not found. Please sign up first.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.ring1} />
      <View style={styles.ring2} />
      <View style={styles.blob} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.flex} />
          <Animated.View style={[styles.header, { opacity: fadeTitle, transform: [{ translateY: slideTitle }] }]}>
            <Text style={styles.eyebrow}>Welcome back</Text>
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.subtitle}>Bid, win, and collect — pick up where you left off.</Text>
          </Animated.View>
          <Animated.View style={[styles.form, { opacity: fadeForm, transform: [{ translateY: slideForm }] }]}>
            <AnimatedInput label="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <View style={styles.spacer} />
            <AnimatedInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              rightElement={
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="rgba(255,255,255,0.4)" />
                </Pressable>
              }
            />
            <View style={styles.btnSpacer} />
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <TouchableOpacity activeOpacity={0.9} onPressIn={() => animateButton(0.97)} onPressOut={() => animateButton(1)} onPress={handleLogin} disabled={loading} style={styles.btnFull}>
                {loading ? <ActivityIndicator color="#000" /> : (
                  <View style={styles.btnContent}>
                    <Text style={styles.btnText}>Sign In</Text>
                    <Ionicons name="arrow-forward" size={18} color="#000" />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
          <Animated.View style={[styles.footer, { opacity: fadeFooter }]}>
            <Text style={styles.footerText}>Dont have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/sign-up')}>
              <Text style={styles.footerLink}>Create one</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0A0A' },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 16, paddingTop: 60, paddingBottom: 24, justifyContent: 'flex-end' },
  ring1: { position: 'absolute', width: 320, height: 320, borderRadius: 160, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)', top: -80, left: -80 },
  ring2: { position: 'absolute', width: 260, height: 260, borderRadius: 130, borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)', bottom: 100, right: -60 },
  blob: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.02)', top: 260, left: -30 },
  header: { marginBottom: 32 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 10 },
  title: { fontSize: 38, fontWeight: '800', color: '#FFFFFF', letterSpacing: -1, lineHeight: 44, marginBottom: 12 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 22, maxWidth: 260 },
  form: {},
  spacer: { height: 12 },
  btnSpacer: { height: 36 },
  btnFull: { width: '100%', height: 54, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  btnContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btnText: { fontSize: 16, fontWeight: '700', color: '#000' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 32, marginBottom: 8 },
  footerText: { fontSize: 14, color: 'rgba(255,255,255,0.35)' },
  footerLink: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});