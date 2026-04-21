import { useAuthAnimations } from '@/hooks/useAuthAnimations';
import { useAuthAPI } from '@/hooks/useAuthAPI';
import { useVerifyOTPForm } from '@/hooks/useVerifyOTPForm';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function VerifyOTPScreen() {
    const { otp, setOtp, email, loading, setLoading, resendTimer, errorMessage, setErrorMessage, validateOTP, setResendCooldown } = useVerifyOTPForm();
    const { fadeTitle, slideTitle, fadeForm, slideForm, fadeFooter, btnScale, animateButton } = useAuthAnimations();
    const { verifyOTP, resendOTP } = useAuthAPI();

    const handleVerifyOTP = async () => {
        if (!validateOTP()) {
            return;
        }

        setLoading(true);
        const result = await verifyOTP(email, otp);
        
        if (!result.success) {
            setErrorMessage(result.message);
            setLoading(false);
            return;
        }

        await AsyncStorage.setItem('emailVerified', 'true');
        await AsyncStorage.removeItem('signupEmail');
        
        setLoading(false);
        router.replace('/home');
    };

    const handleResendOTP = async () => {
        if (resendTimer > 0) return;

        setLoading(true);
        const result = await resendOTP(email);
        
        if (!result.success) {
            setErrorMessage(result.message);
            setLoading(false);
            return;
        }

        setResendCooldown();
        alert(`Verification code has been resent to ${email}`);
        setLoading(false);
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
                        <Text style={styles.eyebrow}>Verify Email</Text>
                        <Text style={styles.title}>Enter OTP</Text>
                        <Text style={styles.subtitle}>Weve sent a 6-digit code to {email || 'your email'}. Please enter it below.</Text>
                    </Animated.View>

                    <Animated.View style={[styles.form, { opacity: fadeForm, transform: [{ translateY: slideForm }] }]}>
                        <Text style={styles.label}>OTP Code</Text>
                        <TextInput
                            style={styles.otpInput}
                            placeholder="000000"
                            placeholderTextColor="rgba(255,255,255,0.2)"
                            value={otp}
                            onChangeText={setOtp}
                            maxLength={6}
                            keyboardType="number-pad"
                            editable={!loading}
                        />
                        
                        {errorMessage ? (
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        ) : null}

                        <View style={styles.btnSpacer} />

                        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPressIn={() => animateButton(0.97)}
                                onPressOut={() => animateButton(1)}
                                onPress={handleVerifyOTP}
                                disabled={loading}
                                style={styles.btnFull}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#000" />
                                ) : (
                                    <View style={styles.btnContent}>
                                        <Text style={styles.btnText}>Verify OTP</Text>
                                        <Ionicons name="checkmark" size={18} color="#000" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </Animated.View>

                        <View style={styles.resendContainer}>
                            <Text style={styles.resendText}>Didnt receive code? </Text>
                            <TouchableOpacity 
                                onPress={handleResendOTP} 
                                disabled={resendTimer > 0 || loading}
                            >
                                <Text style={[styles.resendLink, resendTimer > 0 && styles.resendDisabled]}>
                                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    <Animated.View style={[styles.footer, { opacity: fadeFooter }]}>
                        <Text style={styles.footerText}>Back to </Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.footerLink}>sign up</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#0A0A0A',
    },
    flex: {
        flex: 1,
    },
    scroll: {
        flexGrow: 1,
    },
    ring1: {
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: 200,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        top: -150,
        right: -100,
    },
    ring2: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.03)',
        bottom: -100,
        left: -50,
    },
    blob: {
        position: 'absolute',
        width: 200,
        height: 200,
        backgroundColor: 'rgba(255, 192, 203, 0.05)',
        borderRadius: 100,
        bottom: 100,
        right: 50,
    },
    header: {
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    eyebrow: {
        fontSize: 12,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.4)',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        lineHeight: 20,
    },
    form: {
        paddingHorizontal: 24,
        marginBottom: 40,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.4)',
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    otpInput: {
        height: 60,
        borderBottomWidth: 2,
        borderBottomColor: 'rgba(255, 255, 255, 0.2)',
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '700',
        textAlign: 'center',
        letterSpacing: 12,
        paddingHorizontal: 16,
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 12,
        marginTop: 12,
        textAlign: 'center',
    },
    btnSpacer: {
        height: 24,
    },
    btnFull: {
        backgroundColor: '#FFFFFF',
        height: 54,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    btnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    resendText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    resendLink: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    resendDisabled: {
        color: 'rgba(255, 255, 255, 0.3)',
    },
    footer: {
        paddingHorizontal: 24,
        marginBottom: 32,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    footerLink: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
