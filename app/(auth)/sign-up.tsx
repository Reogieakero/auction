import { AnimatedInput } from '@/components/ui/AnimatedInput';
import { useAuthAnimations } from '@/hooks/useAuthAnimations';
import { useAuthAPI } from '@/hooks/useAuthAPI';
import { useSignUpForm } from '@/hooks/useSignUpForm';
import { useSignUpProgressBar } from '@/hooks/useSignUpProgressBar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
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
    View
} from 'react-native';

export default function SignUpScreen() {
  const { email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, showPassword, setShowPassword, showConfirm, setShowConfirm, loading, setLoading, showConfirmStep, setShowConfirmStep, validateForm, createUser } = useSignUpForm();
  const { fadeTitle, slideTitle, fadeForm, slideForm, fadeFooter, btnScale, animateButton } = useAuthAnimations();
  const { progressBarWidth, confirmAnim } = useSignUpProgressBar(password, showConfirmStep);
  const { sendOTP } = useAuthAPI();

  useEffect(() => {
    if (password.length > 0 && !showConfirmStep) {
      setShowConfirmStep(true);
    }
  }, [password, showConfirmStep, setShowConfirmStep]);

  const handleSignUp = async () => {
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const result = await createUser();
    if (!result.success) {
      alert(result.error || 'Sign-up failed');
      return;
    }

    const otpResult = await sendOTP(result.userEmail || email);
    if (!otpResult.success) {
      alert(`Account created, but failed to send verification code: ${otpResult.message}. Please try again or resend later.`);
      setLoading(false);
      return;
    }

    alert(`Account created! A verification code has been sent to ${result.userEmail || email}. Please check your email.`);
    setLoading(false);
    router.replace('/(auth)/verify-otp');
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