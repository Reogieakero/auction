import { auth } from '@/constants/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';

interface SignUpError {
  field?: string;
  message: string;
}

export const useSignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmStep, setShowConfirmStep] = useState(false);
  const [error, setError] = useState<SignUpError | null>(null);

  const validateForm = (): boolean => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError({ message: 'Please fill in all fields' });
      return false;
    }

    if (password !== confirmPassword) {
      setError({ message: 'Passwords do not match' });
      return false;
    }

    if (password.length < 8) {
      setError({ message: 'Password must be at least 8 characters' });
      return false;
    }

    return true;
  };

  const createUser = async (): Promise<{ success: boolean; userEmail?: string; error?: string }> => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const firebaseToken = await user.getIdToken();

      await AsyncStorage.setItem('signupEmail', user.email || email);
      await AsyncStorage.setItem('firebaseToken', firebaseToken);
      await AsyncStorage.setItem('firebaseUser', JSON.stringify({
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email || '',
      }));

      return {
        success: true,
        userEmail: user.email || email,
      };
    } catch (err: any) {
      let errorMessage = 'Sign-up failed';

      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already registered. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Use at least 8 characters.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (err.message) {
        errorMessage = err.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirm,
    setShowConfirm,
    loading,
    setLoading,
    showConfirmStep,
    setShowConfirmStep,
    error,
    setError,
    validateForm,
    createUser,
  };
};
