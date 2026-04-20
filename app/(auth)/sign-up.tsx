import { AnimatedInput } from '@/components/ui/AnimatedInput';
import { auth } from '@/constants/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    KeyboardAvoidingView,
    LayoutAnimation,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmStep, setShowConfirmStep] = useState(false);

  const fadeTitle = useRef(new Animated.Value(0)).current;
  const slideTitle = useRef(new Animated.Value(24)).current;
  const fadeForm = useRef(new Animated.Value(0)).current;
  const slideForm = useRef(new Animated.Value(32)).current;
  const fadeFooter = useRef(new Animated.Value(0)).current;
  const progressBarWidth = useRef(new Animated.Value(0.5)).current;
  const confirmAnim = useRef(new Animated.Value(0)).current;
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

  useEffect(() => {
    if (password.length > 0 && !showConfirmStep) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShowConfirmStep(true);
      Animated.parallel([
        Animated.spring(confirmAnim, { toValue: 1, useNativeDriver: true }),
        Animated.timing(progressBarWidth, { toValue: 1, duration: 400, useNativeDriver: false })
      ]).start();
    }
  }, [password, showConfirmStep, confirmAnim, progressBarWidth]);

  const animateButton = (toValue: number) => {
    Animated.spring(btnScale, {
      toValue,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      alert('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      alert('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const firebaseToken = await user.getIdToken();

      // Store email temporarily for verification
      await AsyncStorage.setItem('signupEmail', user.email || email);

      // Store user data but mark as not verified yet
      await AsyncStorage.setItem('firebaseToken', firebaseToken);
      await AsyncStorage.setItem('firebaseUser', JSON.stringify({
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email || '',
      }));

      console.log('Sign-up successful. Sending OTP to email...');
      
      // Send OTP email via backend
      try {
        const backendUrl = Constants.expoConfig?.extra?.BACKEND_URL || 'http://192.168.1.6:3000';
        const response = await fetch(`${backendUrl}/api/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email || email }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to send verification code');
        }

        console.log('OTP sent successfully');
        
        // Show a message about OTP being sent
        alert(`Account created! A verification code has been sent to ${user.email || email}. Please check your email.`);
        
        setLoading(false);
        router.replace('/(auth)/verify-otp');
      } catch (emailError: any) {
        console.error('Error sending OTP email:', emailError);
        alert(`Account created, but failed to send verification code: ${emailError.message}. Please try again or resend later.`);
        setLoading(false);
      }
    } catch (error: any) {
      console.error('Sign-up error:', error);
      let errorMessage = 'Sign-up failed';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already registered. Please sign in instead.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Use at least 8 characters.';
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
      <View style={styles.progressContainer}>
        <Animated.View 
          style={[
            styles.progressBar, 
            { width: progressBarWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              }) 
            }
          ]} 
        />
      </View>

      <View style={styles.ring1} />
      <View style={styles.ring2} />
      <View style={styles.blob} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.flex} />

          <Animated.View style={[styles.header, { opacity: fadeTitle, transform: [{ translateY: slideTitle }] }]}>
            <Text style={styles.eyebrow}>{showConfirmStep ? 'Security Step' : 'New here'}</Text>
            <Text style={styles.title}>{showConfirmStep ? 'Confirm\nPassword' : 'Create\nAccount'}</Text>
            <Text style={styles.subtitle}>Join thousands of bidders. Find something worth winning.</Text>
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

            {showConfirmStep && (
              <Animated.View style={{
                opacity: confirmAnim,
                transform: [{ translateY: confirmAnim.interpolate({ inputRange: [0, 1], outputRange: [-15, 0] }) }]
              }}>
                <View style={styles.spacer} />
                <AnimatedInput
                  label="Confirm password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirm}
                  rightElement={
                    <Pressable onPress={() => setShowConfirm(!showConfirm)}>
                      <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={18} color="rgba(255,255,255,0.4)" />
                    </Pressable>
                  }
                />
              </Animated.View>
            )}

            <Text style={styles.hint}>Use 8+ characters with a mix of letters and numbers.</Text>
            <View style={styles.btnSpacer} />

            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPressIn={() => animateButton(0.97)}
                onPressOut={() => animateButton(1)}
                onPress={handleSignUp}
                disabled={loading}
                style={styles.btnFull}
              >
                {loading ? <ActivityIndicator color="#000" /> : (
                  <View style={styles.btnContent}>
                    <Text style={styles.btnText}>Create Account</Text>
                    <Ionicons name="arrow-forward" size={18} color="#000" />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
            
            <Text style={styles.terms}>
              By continuing, you agree to our <Text style={styles.termsLink}>Terms</Text> & <Text style={styles.termsLink}>Privacy</Text>.
            </Text>
          </Animated.View>

          <Animated.View style={[styles.footer, { opacity: fadeFooter }]}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/sign-in')}>
              <Text style={styles.footerLink}>Sign in</Text>
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
  progressContainer: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: '#1A1A1A', zIndex: 10 },
  progressBar: { height: '100%', backgroundColor: '#FFFFFF' },
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
  hint: { fontSize: 11, color: 'rgba(255,255,255,0.22)', marginTop: 12, lineHeight: 16 },
  btnSpacer: { height: 36 },
  btnFull: { width: '100%', height: 54, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  btnContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btnText: { fontSize: 16, fontWeight: '700', color: '#000' },
  terms: { fontSize: 11, color: 'rgba(255,255,255,0.22)', textAlign: 'center', marginTop: 24 },
  termsLink: { color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 32, marginBottom: 8 },
  footerText: { fontSize: 14, color: 'rgba(255,255,255,0.35)' },
  footerLink: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});