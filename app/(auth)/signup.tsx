import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/config';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import tmdb from '@/api/tmdb';

const { height } = Dimensions.get('window');

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [backdropUrl, setBackdropUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const { signUp, isLoading } = useAuth();

  useEffect(() => {
    tmdb.getPopularMovies(1).then((res) => {
      const movie = res.results?.find((m) => m.backdrop_path);
      if (movie?.backdrop_path) {
        setBackdropUrl(tmdb.getBackdropUrl(movie.backdrop_path, 'backdrop'));
      }
    }).catch(() => {});
  }, []);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    else if (username.length < 3) newErrors.username = 'Must be at least 3 characters';
    else if (!/^[a-zA-Z0-9_]+$/.test(username))
      newErrors.username = 'Only letters, numbers, and underscores';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Must be at least 6 characters';
    if (password !== confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    try {
      await signUp(email.trim(), password, username.trim());
      // AuthGuard will auto-redirect if session is created immediately.
      // If email confirmation is required, show a message.
      Alert.alert(
        'Account Created!',
        'Welcome to CineMate. If email verification is enabled, please check your inbox.',
        [{ text: 'OK' }]
      );
    } catch {
      // Error handled in useAuth
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background */}
      {backdropUrl && (
        <Image
          source={{ uri: backdropUrl }}
          style={StyleSheet.absoluteFill}
          blurRadius={3}
        />
      )}
      <LinearGradient
        colors={['rgba(20,20,20,0.4)', 'rgba(20,20,20,0.9)', COLORS.background]}
        locations={[0, 0.45, 0.8]}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace('/(auth)/login')}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>

          {/* Branding */}
          <View style={styles.header}>
            <Text style={styles.title}>Join CineMate</Text>
            <Text style={styles.subtitle}>
              Create your account and start discovering amazing movies
            </Text>
          </View>

          {/* Glass Card */}
          <View style={styles.card}>
            <Input
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoComplete="username"
              icon="person-outline"
              error={errors.username}
            />
            <Input
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              icon="mail-outline"
              error={errors.email}
            />
            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              isPassword
              autoComplete="new-password"
              icon="lock-closed-outline"
              error={errors.password}
            />
            <Input
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword
              autoComplete="new-password"
              icon="lock-closed-outline"
              error={errors.confirmPassword}
            />

            <Button
              title="Create Account"
              onPress={handleSignup}
              loading={isLoading}
              style={styles.signUpButton}
            />

            {/* Terms */}
            <Text style={styles.terms}>
              By signing up, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },

  // Back
  backButton: {
    marginTop: height * 0.06,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Header
  header: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },

  // Card
  card: {
    backgroundColor: 'rgba(31, 31, 31, 0.85)',
    borderRadius: BORDER_RADIUS.xl + 4,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  signUpButton: {
    marginTop: SPACING.sm,
  },
  terms: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: SPACING.md,
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
