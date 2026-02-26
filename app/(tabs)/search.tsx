import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/config';
import { useSearch } from '@/hooks/useSearch';
import tmdb from '@/api/tmdb';
import type { Movie } from '@/types/movie';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.md * 3) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    genres,
    movies,
    searchLoading,
    isSearchActive,
  } = useSearch();

  const handleMoviePress = useCallback(
    (movie: Movie) => router.push(`/movie/${movie.id}`),
    [router]
  );

  const renderMovieCard = ({ item, index }: { item: Movie; index: number }) => {
    const hasPoster = !!item.poster_path;
    const marginLeft = index % 2 === 0 ? SPACING.md : SPACING.sm;
    const marginRight = index % 2 === 1 ? SPACING.md : SPACING.sm;

    return (
      <TouchableOpacity
        style={[styles.card, { marginLeft, marginRight }]}
        onPress={() => handleMoviePress(item)}
        activeOpacity={0.8}
      >
        {hasPoster ? (
          <Image
            source={{ uri: tmdb.getImageUrl(item.poster_path!, 'medium') }}
            style={styles.poster}
          />
        ) : (
          <View style={[styles.poster, styles.posterPlaceholder]}>
            <Ionicons name="image-outline" size={32} color={COLORS.textMuted} />
          </View>
        )}
        <View style={styles.cardOverlay}>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={10} color={COLORS.warning} />
            <Text style={styles.ratingText}>
              {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
            </Text>
          </View>
        </View>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const sectionTitle = isSearchActive
    ? `Results for "${searchQuery}"`
    : selectedGenre
      ? genres.find((g) => g.id === selectedGenre)?.name || 'Movies'
      : 'Trending Now';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Search Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search movies..."
            placeholderTextColor={COLORS.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            selectionColor={COLORS.primary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Genre Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.genreScroll}
        contentContainerStyle={styles.genreContainer}
      >
        <TouchableOpacity
          style={[styles.genreChip, !selectedGenre && styles.genreChipActive]}
          onPress={() => setSelectedGenre(null)}
        >
          <Text style={[styles.genreChipText, !selectedGenre && styles.genreChipTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {genres.map((genre) => (
          <TouchableOpacity
            key={genre.id}
            style={[styles.genreChip, selectedGenre === genre.id && styles.genreChipActive]}
            onPress={() => setSelectedGenre(genre.id)}
          >
            <Text
              style={[
                styles.genreChipText,
                selectedGenre === genre.id && styles.genreChipTextActive,
              ]}
            >
              {genre.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Section Title */}
      <Text style={styles.sectionTitle}>{sectionTitle}</Text>

      {/* Results */}
      {searchLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : movies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="film-outline" size={56} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>No movies found</Text>
          <Text style={styles.emptySubtext}>Try a different search or genre</Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          renderItem={renderMovieCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContainer}
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
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
  },
  searchRow: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    height: '100%',
  },
  clearButton: {
    padding: SPACING.xs,
  },
  genreScroll: {
    maxHeight: 44,
    marginBottom: SPACING.sm,
  },
  genreContainer: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  genreChip: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  genreChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genreChipText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  genreChipTextActive: {
    color: COLORS.text,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  gridContainer: {
    paddingBottom: SPACING.xxl,
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
  cardOverlay: {
    position: 'absolute',
    top: SPACING.xs,
    left: SPACING.xs,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
    gap: 3,
  },
  ratingText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '700',
  },
  cardTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    marginTop: SPACING.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
});
