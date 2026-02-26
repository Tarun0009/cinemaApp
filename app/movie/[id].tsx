import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  Share,
  Alert,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import tmdb from "@/api/tmdb";
import { COLORS, SPACING, BORDER_RADIUS } from "@/constants/config";
import { storage } from "@/utils/storage";
import { useWatchlist } from "@/hooks/useWatchlist";
import type { MovieDetails, CastMember, Movie } from "@/types/movie";

const { width, height } = Dimensions.get("window");
const BACKDROP_HEIGHT = height * 0.45;

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const movieId = Number(id);

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState(false);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  async function loadMovie() {
    try {
      setLoading(true);
      setError(false);
      const res = await tmdb.getMovieDetails(movieId);
      setMovie(res);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function checkFavoriteStatus() {
    const favorite = await storage.isFavorite(movieId);
    setIsFavorite(favorite);
  }

  useEffect(() => {
    loadMovie();
    checkFavoriteStatus();
  }, [movieId]);

  const handleFavoritePress = async () => {
    if (!movie) return;
    try {
      if (isFavorite) {
        await storage.removeFavorite(movieId);
        setIsFavorite(false);
      } else {
        await storage.addFavorite({ ...movie, addedAt: Date.now() });
        setIsFavorite(true);
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      Alert.alert("Error", "Failed to update favorites");
    }
  };

  const handleShare = async () => {
    if (!movie) return;
    try {
      await Share.share({
        message: `Check out "${movie.title}" on CineMate! Rating: ${movie.vote_average?.toFixed(1)}/10`,
      });
    } catch {}
  };

  function formatRuntime(minutes: number) {
    if (!minutes) return "";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.centered}>
        <StatusBar style="light" />
        <Ionicons name="alert-circle-outline" size={56} color={COLORS.textMuted} />
        <Text style={styles.errorText}>Failed to load movie</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadMovie}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={styles.goBackButton}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? tmdb.getBackdropUrl(movie.backdrop_path, "backdrop")
    : null;
  const posterUrl = movie.poster_path
    ? tmdb.getImageUrl(movie.poster_path, "large")
    : null;
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "";
  const cast: CastMember[] = movie.credits?.cast?.slice(0, 10) || [];
  const similarMovies: Movie[] = movie.similar?.results?.slice(0, 10) || [];
  const director = movie.credits?.crew?.find((c) => c.job === "Director");

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Floating Header */}
      <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.headerBtn}>
          <Ionicons name="share-outline" size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Backdrop */}
        <View style={styles.backdropContainer}>
          {backdropUrl ? (
            <Image source={{ uri: backdropUrl }} style={styles.backdrop} />
          ) : (
            <View style={[styles.backdrop, { backgroundColor: COLORS.surface }]} />
          )}
          <LinearGradient
            colors={["transparent", "rgba(20,20,20,0.6)", COLORS.background]}
            locations={[0.3, 0.7, 1]}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* Poster + Info */}
        <View style={styles.infoSection}>
          <View style={styles.posterRow}>
            <View style={styles.posterWrapper}>
              {posterUrl ? (
                <Image source={{ uri: posterUrl }} style={styles.poster} />
              ) : (
                <View style={[styles.poster, styles.posterPlaceholder]}>
                  <Ionicons name="film-outline" size={32} color={COLORS.textMuted} />
                </View>
              )}
            </View>

            <View style={styles.metaInfo}>
              <Text style={styles.movieTitle} numberOfLines={3}>
                {movie.title}
              </Text>

              {movie.tagline ? (
                <Text style={styles.tagline} numberOfLines={2}>
                  {`"${movie.tagline}"`}
                </Text>
              ) : null}

              <View style={styles.metaTags}>
                {year ? (
                  <View style={styles.tag}>
                    <Ionicons name="calendar-outline" size={12} color={COLORS.textSecondary} />
                    <Text style={styles.tagText}>{year}</Text>
                  </View>
                ) : null}
                {movie.runtime ? (
                  <View style={styles.tag}>
                    <Ionicons name="time-outline" size={12} color={COLORS.textSecondary} />
                    <Text style={styles.tagText}>{formatRuntime(movie.runtime)}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.ratingRow}>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={16} color={COLORS.warning} />
                  <Text style={styles.ratingValue}>{rating}</Text>
                  <Text style={styles.ratingMax}>/10</Text>
                </View>
                <Text style={styles.voteCount}>
                  {movie.vote_count?.toLocaleString()} votes
                </Text>
              </View>
            </View>
          </View>

          {/* Genre Pills */}
          {movie.genres && movie.genres.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.genreScroll}
              contentContainerStyle={styles.genreContainer}
            >
              {movie.genres.map((g) => (
                <View key={g.id} style={styles.genrePill}>
                  <Text style={styles.genrePillText}>{g.name}</Text>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, isFavorite && styles.actionButtonActive]}
              onPress={handleFavoritePress}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={20}
                color={isFavorite ? COLORS.primary : COLORS.text}
              />
              <Text style={[styles.actionText, isFavorite && styles.actionTextActive]}>
                {isFavorite ? "Favorited" : "Favorite"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, isInWatchlist(movieId) && styles.actionButtonWatchlist]}
              onPress={() => toggleWatchlist({ id: movieId, title: movie.title, poster_path: movie.poster_path ?? null })}
            >
              <Ionicons
                name={isInWatchlist(movieId) ? "bookmark" : "bookmark-outline"}
                size={20}
                color={isInWatchlist(movieId) ? COLORS.warning : COLORS.text}
              />
              <Text style={[styles.actionText, isInWatchlist(movieId) && styles.actionTextWatchlist]}>
                {isInWatchlist(movieId) ? "Listed" : "Watchlist"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Ionicons name="share-social-outline" size={20} color={COLORS.text} />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>

          {/* Storyline */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Storyline</Text>
            <Text style={styles.overviewText}>
              {movie.overview || "No overview available."}
            </Text>
          </View>

          {/* Director */}
          {director && (
            <View style={styles.directorRow}>
              <Text style={styles.directorLabel}>Director</Text>
              <Text style={styles.directorName}>{director.name}</Text>
            </View>
          )}

          {/* Cast */}
          {cast.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cast</Text>
              <FlatList
                horizontal
                data={cast}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.castList}
                renderItem={({ item }) => (
                  <View style={styles.castCard}>
                    {item.profile_path ? (
                      <Image
                        source={{ uri: tmdb.getImageUrl(item.profile_path, "small") }}
                        style={styles.castImage}
                      />
                    ) : (
                      <View style={[styles.castImage, styles.castPlaceholder]}>
                        <Ionicons name="person" size={20} color={COLORS.textMuted} />
                      </View>
                    )}
                    <Text style={styles.castName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.castCharacter} numberOfLines={1}>
                      {item.character}
                    </Text>
                  </View>
                )}
              />
            </View>
          )}

          {/* Details Grid */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailsGrid}>
              <DetailItem label="Status" value={movie.status || "N/A"} />
              <DetailItem
                label="Language"
                value={movie.spoken_languages?.[0]?.english_name || "N/A"}
              />
              <DetailItem
                label="Budget"
                value={
                  movie.budget
                    ? `$${(movie.budget / 1_000_000).toFixed(0)}M`
                    : "N/A"
                }
              />
              <DetailItem
                label="Revenue"
                value={
                  movie.revenue
                    ? `$${(movie.revenue / 1_000_000).toFixed(0)}M`
                    : "N/A"
                }
              />
            </View>
          </View>

          {/* Similar Movies */}
          {similarMovies.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Similar Movies</Text>
              <FlatList
                horizontal
                data={similarMovies}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.similarList}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.similarCard}
                    onPress={() => router.push(`/movie/${item.id}`)}
                    activeOpacity={0.8}
                  >
                    {item.poster_path ? (
                      <Image
                        source={{ uri: tmdb.getImageUrl(item.poster_path, "medium") }}
                        style={styles.similarPoster}
                      />
                    ) : (
                      <View style={[styles.similarPoster, styles.posterPlaceholder]}>
                        <Ionicons name="image-outline" size={24} color={COLORS.textMuted} />
                      </View>
                    )}
                    <Text style={styles.similarTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          <View style={{ height: insets.bottom + 24 }} />
        </View>
      </ScrollView>
    </View>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    gap: SPACING.md,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  errorText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginTop: SPACING.sm,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.sm,
  },
  retryText: {
    color: COLORS.text,
    fontWeight: "600",
  },
  goBackButton: {
    marginTop: SPACING.sm,
  },
  goBackText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },

  floatingHeader: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    zIndex: 20,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },

  backdropContainer: {
    width: "100%",
    height: BACKDROP_HEIGHT,
  },
  backdrop: {
    width: "100%",
    height: "100%",
  },

  infoSection: {
    marginTop: -SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  posterRow: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  posterWrapper: {
    width: width * 0.32,
    height: width * 0.32 * 1.5,
    borderRadius: BORDER_RADIUS.lg,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: { elevation: 12 },
    }),
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  posterPlaceholder: {
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  metaInfo: {
    flex: 1,
    justifyContent: "center",
  },
  movieTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 28,
  },
  tagline: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontStyle: "italic",
    marginTop: SPACING.xs,
    lineHeight: 18,
  },
  metaTags: {
    flexDirection: "row",
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  tagText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 197, 24, 0.12)",
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    gap: 4,
  },
  ratingValue: {
    color: COLORS.warning,
    fontSize: 16,
    fontWeight: "800",
  },
  ratingMax: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  voteCount: {
    color: COLORS.textMuted,
    fontSize: 12,
  },

  genreScroll: {
    marginTop: SPACING.lg,
  },
  genreContainer: {
    gap: SPACING.sm,
  },
  genrePill: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  genrePillText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },

  actionRow: {
    flexDirection: "row",
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md - 2,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionButtonActive: {
    backgroundColor: "rgba(229, 9, 20, 0.12)",
    borderColor: COLORS.primary,
  },
  actionText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },
  actionTextActive: {
    color: COLORS.primary,
  },
  actionButtonWatchlist: {
    backgroundColor: "rgba(245, 197, 24, 0.12)",
    borderColor: COLORS.warning,
  },
  actionTextWatchlist: {
    color: COLORS.warning,
  },

  section: {
    marginTop: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: "700",
    marginBottom: SPACING.md,
  },
  overviewText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 23,
  },

  directorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  directorLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  directorName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },

  castList: {
    gap: SPACING.md,
  },
  castCard: {
    width: 80,
    alignItems: "center",
  },
  castImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.xs,
  },
  castPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  castName: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  castCharacter: {
    color: COLORS.textMuted,
    fontSize: 10,
    textAlign: "center",
    marginTop: 2,
  },

  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  detailItem: {
    width: (width - SPACING.lg * 2 - SPACING.sm) / 2,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  detailLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailValue: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "600",
  },

  similarList: {
    gap: SPACING.md,
  },
  similarCard: {
    width: 110,
  },
  similarPoster: {
    width: 110,
    height: 165,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
  },
  similarTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: SPACING.xs,
    fontWeight: "500",
  },
});
