// components/MovieList.tsx
import React, { useCallback, useRef, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  ActivityIndicator,
  Dimensions,
  Platform,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { COLORS, SPACING } from '@/constants/config';
import MovieCard from './MovieCard';
import type { Movie } from '@/types/movie';

const { width: WINDOW_WIDTH } = Dimensions.get('window');

/**
 * Layout decisions:
 * - Default two-column grid on phones (like Netflix/Prime list)
 * - CARD_WIDTH/CARD_HEIGHT tuned to poster aspect (2:3) with space for title
 */
const DEFAULT_NUM_COLUMNS = 2;
const GUTTER = SPACING.md;
const HORIZONTAL_PADDING = SPACING.md * 2;

function calcCardWidth(numColumns: number) {
  return Math.floor((WINDOW_WIDTH - HORIZONTAL_PADDING - (numColumns - 1) * GUTTER) / numColumns);
}

function calcCardHeight(cardWidth: number) {
  return Math.round(cardWidth * 1.5); // poster 2:3 ~ 1.5
}

interface Props {
  movies: Movie[];
  loading?: boolean;
  error?: string | null;
  refreshing?: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  onMoviePress?: (movie: Movie) => void;
  onFavoritePress?: (movie: Movie) => void;
  favorites?: Set<number>;
  hasMore?: boolean;
  numColumns?: number; // 1 = list, 2 = grid, etc
  horizontal?: boolean; // if true shows a horizontal carousel
  compact?: boolean; // smaller cards (useful for compact rows)
  emptyText?: string;
  ListHeaderComponent?: React.ReactElement | null;
}

const MovieList: React.FC<Props> = ({
  movies = [],
  loading = false,
  error = null,
  refreshing = false,
  onRefresh,
  onLoadMore,
  onMoviePress,
  onFavoritePress,
  favorites,
  hasMore = false,
  numColumns = DEFAULT_NUM_COLUMNS,
  horizontal = false,
  compact = false,
  emptyText = 'No movies found.',
  ListHeaderComponent = null,
}) => {
  const cardWidth = useMemo(() => calcCardWidth(numColumns), [numColumns]);
  const cardHeight = useMemo(() => calcCardHeight(cardWidth), [cardWidth]);

  // prevents multiple onEndReached calls while loading
  const loadingMoreRef = useRef(false);

  const safeOnLoadMore = useCallback(() => {
    if (!hasMore || loading || loadingMoreRef.current) return;
    loadingMoreRef.current = true;
    try {
      onLoadMore?.();
    } finally {
      // small delay to avoid repeated immediate triggers (onEndReached jitter)
      setTimeout(() => {
        loadingMoreRef.current = false;
      }, 600);
    }
  }, [hasMore, loading, onLoadMore]);

  // Memoize renderItem to avoid re-creating function each render
  const renderItem = useCallback(
    ({ item, index }: { item: Movie; index: number }) => {
      const marginLeft = numColumns > 1 ? (index % numColumns === 0 ? 0 : GUTTER) : 0;

      return (
        <View
          style={[
            styles.itemContainer,
            {
              width: cardWidth,
              marginBottom: GUTTER,
              marginLeft,
            },
          ]}
        >
          <MovieCard
            movie={item}
            onPress={() => onMoviePress?.(item)}
            isFavorite={Boolean(favorites?.has?.(item.id))}
            onFavoritePress={onFavoritePress ? () => onFavoritePress(item) : undefined}
            compact={compact}
            style={{ width: cardWidth, height: cardHeight }}
          />
        </View>
      );
    },
    [cardWidth, cardHeight, numColumns, onMoviePress, onFavoritePress, favorites, compact],
  );

  // Key extractor
  const keyExtractor = useCallback((item: Movie) => item.id.toString(), []);

  // getItemLayout helps FlatList skip measurement — huge perf win
  const getItemLayout = useCallback(
    (_data: ArrayLike<Movie> | null | undefined, index: number) => {
      if (horizontal) {
        // For horizontal single-row carousel
        const length = cardWidth + GUTTER;
        return { length, offset: index * length, index };
      } else {
        // For grid: compute row index
        const row = Math.floor(index / numColumns);
        const length = cardHeight + GUTTER;
        const offset = row * length;
        return { length, offset, index };
      }
    },
    [cardWidth, cardHeight, numColumns, horizontal],
  );

  const ListFooter = React.useMemo(() => {
    if (!hasMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  }, [hasMore]);

  const ListEmpty = React.useMemo(() => {
    if (loading) {
      // subtle skeleton placeholder
      return (
        <View style={styles.emptyLoading}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading movies…</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{error ?? emptyText}</Text>
      </View>
    );
  }, [loading, error, emptyText]);

  // onScroll handler can be used to implement sticky headers or fancy animations.
  const handleScroll = useCallback((_e: NativeSyntheticEvent<NativeScrollEvent>) => {
    /* noop for now — keep hook stable for future animation optimizations */
  }, []);

  // Render wrapper to support horizontal carousels or vertical grid.
  if (horizontal) {
    return (
      <View style={[styles.carouselWrap, { paddingLeft: SPACING.md }]}>
        <FlatList
          data={movies}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onMoviePress?.(item)}
              style={{ marginRight: GUTTER }}
            >
              <MovieCard
                movie={item}
                onPress={() => onMoviePress?.(item)}
                isFavorite={Boolean(favorites?.has?.(item.id))}
                onFavoritePress={onFavoritePress ? () => onFavoritePress(item) : undefined}
                compact={compact}
                style={{ width: cardWidth, height: cardHeight }}
              />
            </TouchableOpacity>
          )}
          keyExtractor={keyExtractor}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={6}
          removeClippedSubviews={Platform.OS === 'android'}
          onEndReached={safeOnLoadMore}
          onEndReachedThreshold={0.6}
          ListEmptyComponent={ListEmpty}
          ListFooterComponent={ListFooter}
        />
      </View>
    );
  }

  // Vertical grid/list
  return (
    <FlatList
      data={movies}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={numColumns}
      contentContainerStyle={[
        styles.container,
        movies.length === 0 && styles.emptyContent,
      ]}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        ) : undefined
      }
      onEndReached={safeOnLoadMore}
      onEndReachedThreshold={0.6}
      ListFooterComponent={ListFooter}
      ListEmptyComponent={ListEmpty}
      showsVerticalScrollIndicator={false}
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={7}
      removeClippedSubviews={true}
      getItemLayout={getItemLayout}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
    backgroundColor: COLORS.background,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  itemContainer: {
    // width is set dynamically
    marginBottom: SPACING.md,
  },
  footer: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    width: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 260,
    paddingHorizontal: SPACING.xl,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyLoading: {
    alignItems: 'center',
    paddingVertical: 40,
  },  
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  carouselWrap: {
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
  },
});

export default React.memo(MovieList);
