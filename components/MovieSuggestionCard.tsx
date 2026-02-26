import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/config';
import tmdb from '@/api/tmdb';
import type { Movie } from '@/types/movie';

interface MovieSuggestionCardProps {
  movie: Movie;
  onPress: () => void;
}

export default function MovieSuggestionCard({ movie, onPress }: MovieSuggestionCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      {movie.poster_path ? (
        <Image
          source={{ uri: tmdb.getImageUrl(movie.poster_path, 'small') }}
          style={styles.poster}
        />
      ) : (
        <View style={[styles.poster, styles.placeholder]}>
          <Ionicons name="film-outline" size={18} color={COLORS.textMuted} />
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {movie.title}
        </Text>
        <View style={styles.meta}>
          <Ionicons name="star" size={10} color={COLORS.warning} />
          <Text style={styles.rating}>
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </Text>
          {movie.release_date && (
            <Text style={styles.year}>
              {new Date(movie.release_date).getFullYear()}
            </Text>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={14} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    marginRight: SPACING.sm,
    width: 200,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  poster: {
    width: 40,
    height: 60,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.background,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: SPACING.sm,
    marginRight: SPACING.xs,
  },
  title: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 3,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  rating: {
    color: COLORS.warning,
    fontSize: 11,
    fontWeight: '600',
  },
  year: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginLeft: 4,
  },
});
