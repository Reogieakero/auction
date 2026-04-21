import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export const useVerifyOTPForm = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const getEmail = async () => {
      const storedEmail = await AsyncStorage.getItem('signupEmail');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    };
    getEmail();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const validateOTP = (): boolean => {
    if (!otp || otp.length < 6) {
      setErrorMessage('Please enter a valid 6-digit OTP');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const clearError = () => {
    setErrorMessage('');
  };

  const setResendCooldown = () => {
    setResendTimer(60);
    setErrorMessage('');
  };

  return {
    otp,
    setOtp,
    email,
    setEmail,
    loading,
    setLoading,
    resendTimer,
    setResendTimer,
    errorMessage,
    setErrorMessage,
    validateOTP,
    clearError,
    setResendCooldown,
  };
};
