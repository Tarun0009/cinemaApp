import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Alert } from 'react-native';

export function useAuth() {
  const {
    user,
    session,
    profile,
    isLoading,
    signUp,
    signIn,
    signOut,
  } = useAuthStore();

  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (
    email: string,
    password: string,
    username: string
  ) => {
    setError(null);
    try {
      await signUp(email, password, username);
    } catch (err: any) {
      const message = err?.message || 'Failed to sign up';
      setError(message);
      Alert.alert('Sign Up Error', message);
      throw err;
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    setError(null);
    try {
      await signIn(email, password);
    } catch (err: any) {
      const message = err?.message || 'Failed to sign in';
      setError(message);
      Alert.alert('Sign In Error', message);
      throw err;
    }
  };

  const handleSignOut = async () => {
    setError(null);
    try {
      await signOut();
    } catch (err: any) {
      const message = err?.message || 'Failed to sign out';
      setError(message);
      Alert.alert('Sign Out Error', message);
    }
  };

  return {
    user,
    session,
    profile,
    isLoading,
    error,
    isAuthenticated: !!session,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
}
