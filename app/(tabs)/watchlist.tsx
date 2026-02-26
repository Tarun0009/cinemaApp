import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/config';
import { useWatchlist } from '@/hooks/useWatchlist';
import tmdb from '@/api/tmdb';
import type { WatchlistItem } from '@/types/movie';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.md * 3) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

export default function WatchlistScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { watchlist, isLoading, removeFromWatchlist } = useWatchlist();

  const handlePress = useCallback(
    (item: WatchlistItem) => router.push(`/movie/${item.movie_id}`),
    [router]
  );

  const handleLongPress = useCallback(
    (item: WatchlistItem) => {
      Alert.alert(
        'Remove from Watchlist',
        `Remove "${item.movie_title}" from your watchlist?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => removeFromWatchlist(item.movie_id),
          },
        ]
      );
    },
    [removeFromWatchlist]
  );

  const renderItem = ({ item, index }: { item: WatchlistItem; index: number }) => {
    const hasPoster = !!item.movie_poster;
    const marginLeft = index % 2 === 0 ? SPACING.md : SPACING.sm;
    const marginRight = index % 2 === 1 ? SPACING.md : SPACING.sm;

    return (
      <TouchableOpacity
        style={[styles.card, { marginLeft, marginRight }]}
        onPress={() => handlePress(item)}
        onLongPress={() => handleLongPress(item)}
        activeOpacity={0.8}
      >
        {hasPoster ? (
          <Image
            source={{ uri: tmdb.getImageUrl(item.movie_poster!, 'medium') }}
            style={styles.poster}
          />
        ) : (
          <View style={[styles.poster, styles.posterPlaceholder]}>
            <Ionicons name="film-outline" size={32} color={COLORS.textMuted} />
          </View>
        )}
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.movie_title}
        </Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {watchlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={64} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>Your watchlist is empty</Text>
          <Text style={styles.emptySubtext}>
            Movies you add to your watchlist will appear here
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push('/(tabs)/search')}
          >
            <Text style={styles.browseButtonText}>Browse Movies</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={watchlist}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.gridContainer,
            { paddingBottom: insets.bottom + SPACING.xxl },
          ]}
          ListHeaderComponent={
            <Text style={styles.countText}>
              {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'}
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    paddingTop: SPACING.sm,
  },
  countText: {
    color: COLORS.textMuted,
    fontSize: 13,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  card: {
    width: CARD_WIDTH,
    marginBottom: SPACING.md,
  },
  poster: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
  },
  posterPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    marginTop: SPACING.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: SPACING.md,
  },
  emptySubtext: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  browseButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.md,
  },
  browseButtonText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
});
