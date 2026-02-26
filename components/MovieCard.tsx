import React, { memo, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Movie } from '@/types/movie';
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/config';
import tmdb from '@/api/tmdb';

const { width } = Dimensions.get('window');
const GRID_PADDING = SPACING.md;
const CARD_WIDTH = (width - GRID_PADDING * 3) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
  compact?: boolean;
  style?: ViewStyle;
}

const MovieCard: React.FC<MovieCardProps> = memo(({
  movie,
  onPress,
  isFavorite = false,
  onFavoritePress,
  compact = false,
  style,
}) => {
  const { rating, year, imageUrl, hasPoster } = useMemo(() => {
    const r = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const y = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
    const posterPath = movie.poster_path;

    return {
      rating: r,
      year: y,
      imageUrl: posterPath
        ? tmdb.getImageUrl(posterPath, 'medium')
        : 'https://via.placeholder.com/342x513?text=No+Poster',
      hasPoster: !!posterPath,
    };
  }, [movie]);

  const cardW = (style as any)?.width || CARD_WIDTH;
  const cardH = (style as any)?.height || CARD_HEIGHT;

  return (
    <TouchableOpacity
      style={[styles.container, { width: cardW }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.card, { borderRadius: compact ? BORDER_RADIUS.sm : BORDER_RADIUS.md }]}>
        {hasPoster ? (
          <Image
            source={{ uri: imageUrl }}
            style={[styles.poster, { height: cardH }]}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.poster, styles.placeholderView, { height: cardH }]}>
            <Ionicons name="image-outline" size={cardW / 4} color={COLORS.textSecondary} />
            <Text style={styles.placeholderText}>No Poster</Text>
          </View>
        )}

        {/* Dark Overlay */}
        <View style={styles.gradient}>
          <View style={[styles.gradientLayer, { opacity: 0.6 }]} />
          <View style={[styles.gradientLayer, { height: '30%', opacity: 0.9 }]} />
        </View>

        {/* Rating Badge */}
        {!compact && (
          <View style={styles.ratingContainer}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color={COLORS.warning} />
              <Text style={styles.ratingText}>{rating}</Text>
            </View>
          </View>
        )}

        {/* Favorite Button */}
        {onFavoritePress && !compact && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={(e) => {
              e.stopPropagation();
              onFavoritePress();
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? COLORS.primary : COLORS.text}
            />
          </TouchableOpacity>
        )}

        {/* Title & Year */}
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {movie.title || 'Untitled Movie'}
          </Text>
          {year !== 'N/A' && !compact && (
            <Text style={styles.year}>{year}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: SPACING.lg,
  },
  card: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  poster: {
    width: '100%',
    height: CARD_HEIGHT,
  },
  placeholderView: {
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  placeholderText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
    justifyContent: 'flex-end',
  },
  gradientLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
    backgroundColor: '#000000',
  },
  ratingContainer: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    zIndex: 10,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    borderLeftWidth: 3,
    borderColor: COLORS.warning,
  },
  ratingText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: BORDER_RADIUS.circle,
    padding: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.sm,
    zIndex: 5,
  },
  title: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: SPACING.xs,
  },
  year: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;
