import { auth } from '@/constants/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';

interface SignInError {
  message: string;
}

export const useSignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SignInError | null>(null);

  const validateForm = (): boolean => {
    if (!email.trim() || !password.trim()) {
      setError({ message: 'Please enter both email and password' });
      return false;
    }
    setError(null);
    return true;
  };

  const signInUser = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const firebaseToken = await user.getIdToken();

      await AsyncStorage.setItem('firebaseToken', firebaseToken);
      await AsyncStorage.setItem('firebaseUser', JSON.stringify({
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email || '',
      }));

      return { success: true };
    } catch (err: any) {
      let errorMessage = 'Sign-in failed';

      if (err.code === 'auth/user-not-found') {
        errorMessage = 'Email not found. Please sign up first.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError({ message: errorMessage });
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
    showPassword,
    setShowPassword,
    loading,
    setLoading,
    error,
    setError,
    validateForm,
    signInUser,
  };
};
