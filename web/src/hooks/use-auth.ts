'use client';

import { useCallback, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';

export function useAuth() {
  const {
    user,
    session,
    profile,
    isLoading,
    signUp: storeSignUp,
    signIn: storeSignIn,
    signOut: storeSignOut,
  } = useAuthStore();

  const [error, setError] = useState<string | null>(null);

  const signUp = useCallback(async (email: string, password: string, username: string) => {
    setError(null);
    try {
      await storeSignUp(email, password, username);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setError(message);
      throw err;
    }
  }, [storeSignUp]);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      await storeSignIn(email, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
      throw err;
    }
  }, [storeSignIn]);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      await storeSignOut();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed';
      setError(message);
    }
  }, [storeSignOut]);

  return {
    user,
    session,
    profile,
    isLoading,
    error,
    isAuthenticated: !!session,
    signUp,
    signIn,
    signOut,
  };
}
