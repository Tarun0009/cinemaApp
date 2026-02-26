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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [backdropUrl, setBackdropUrl] = useState<string | null>(null);
  const { signIn, isLoading } = useAuth();

  useEffect(() => {
    tmdb.getTrendingMovies(1).then((res) => {
      const movie = res.results?.find((m) => m.backdrop_path);
      if (movie?.backdrop_path) {
        setBackdropUrl(tmdb.getBackdropUrl(movie.backdrop_path, 'backdrop'));
      }
    }).catch(() => {});
  }, []);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      await signIn(email.trim(), password);
      // AuthGuard will auto-redirect to home
    } catch {
      // Error handled in useAuth
    }
  };

  const handleSocialPress = (provider: string) => {
    Alert.alert('Coming Soon', `${provider} sign-in will be available in the next update!`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background Movie Poster */}
      {backdropUrl && (
        <Image
          source={{ uri: backdropUrl }}
          style={StyleSheet.absoluteFill}
          blurRadius={2}
        />
      )}

      {/* Dark Gradient Overlay */}
      <LinearGradient
        colors={['rgba(20,20,20,0.3)', 'rgba(20,20,20,0.85)', COLORS.background]}
        locations={[0, 0.5, 0.85]}
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
          {/* Top Spacer */}
          <View style={styles.topSpacer} />

          {/* Branding */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <Ionicons name="film" size={28} color={COLORS.primary} />
              <Text style={styles.logoText}>CINEMATE</Text>
            </View>
            <Text style={styles.tagline}>Discover. Watch. Share.</Text>
          </View>

          {/* Glass Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome Back</Text>
            <Text style={styles.cardSubtitle}>Sign in to your account</Text>

            <View style={styles.form}>
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
                autoComplete="password"
                icon="lock-closed-outline"
                error={errors.password}
              />

              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={isLoading}
                style={styles.signInButton}
              />
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialPress('Google')}>
                <Ionicons name="logo-google" size={20} color={COLORS.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialPress('Apple')}>
                <Ionicons name="logo-apple" size={20} color={COLORS.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialPress('GitHub')}>
                <Ionicons name="logo-github" size={20} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/signup')}>
              <Text style={styles.linkText}>Create Account</Text>
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
  topSpacer: {
    height: height * 0.12,
  },

  // Branding
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl + SPACING.md,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 3,
  },
  tagline: {
    fontSize: 15,
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },

  // Glass Card
  card: {
    backgroundColor: 'rgba(31, 31, 31, 0.85)',
    borderRadius: BORDER_RADIUS.xl + 4,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },
  form: {
    gap: 0,
  },
  signInButton: {
    marginTop: SPACING.sm,
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginHorizontal: SPACING.md,
  },

  // Social
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  socialButton: {
    width: 52,
    height: 52,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
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
