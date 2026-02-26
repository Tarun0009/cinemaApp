import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Movie } from "@/types/movie";
import { COLORS, SPACING, BORDER_RADIUS } from "@/constants/config";
import { useMovies } from "@/hooks/useMovies";
import tmdb from "@/api/tmdb";
import { storage } from "@/utils/storage";

const { height } = Dimensions.get("window");
const FEATURED_HEIGHT = height * 0.55;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const {
    data: trendingMovies = [],
    loading: trendingLoading,
    refreshing,
    refresh,
  } = useMovies("trending");

  const { data: popularMovies = [] } = useMovies("popular");
  const { data: topRatedMovies = [] } = useMovies("topRated");
  const { data: nowPlayingMovies = [] } = useMovies("nowPlaying");

  useEffect(() => {
    if (trendingMovies.length > 0) {
      const movieWithBackdrop = trendingMovies.find((m) => m.backdrop_path);
      setFeaturedMovie(movieWithBackdrop || trendingMovies[0]);
    }
  }, [trendingMovies]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const favs = await storage.getFavorites();
    setFavorites(new Set(favs.map((f) => f.id)));
  };

  const handleMoviePress = useCallback(
    (movie: Movie) => {
      router.push(`/movie/${movie.id}`);
    },
    [router]
  );

  const handleFavoritePress = async (movie: Movie) => {
    if (favorites.has(movie.id)) {
      await storage.removeFavorite(movie.id);
    } else {
      await storage.addFavorite({ ...movie, addedAt: Date.now() });
    }
    loadFavorites();
  };

  const handleSearchPress = () => {
    router.push('/(tabs)/search');
  };

  const Header = () => (
    <BlurView
      intensity={80}
      tint="dark"
      style={[styles.header, { paddingTop: insets.top + 8, height: 60 + insets.top + 8 }]}
    >
      <Text style={styles.logo}>CINEMATE</Text>
      <TouchableOpacity onPress={handleSearchPress}>
        <Ionicons name="search-outline" size={24} color={COLORS.text} />
      </TouchableOpacity>
    </BlurView>
  );

  const Featured = () => {
    if (!featuredMovie) {
      return (
        <View style={[styles.featured, styles.center]}>
          <ActivityIndicator color={COLORS.primary} />
        </View>
      );
    }

    const hasBackdrop = !!featuredMovie.backdrop_path;

    return (
      <View style={styles.featured}>
        {hasBackdrop ? (
          <Image
            source={{
              uri: tmdb.getBackdropUrl(featuredMovie.backdrop_path!, "backdrop"),
            }}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: COLORS.surface }]} />
        )}

        <LinearGradient
          colors={["transparent", COLORS.background]}
          style={styles.featuredGradient}
        />

        <View style={styles.featuredContent}>
          <View style={styles.featuredBadge}>
            <Ionicons name="trending-up" size={14} color={COLORS.warning} />
            <Text style={styles.featuredBadgeText}>TRENDING</Text>
          </View>

          <Text style={styles.featuredTitle}>{featuredMovie.title}</Text>

          {featuredMovie.overview ? (
            <Text style={styles.featuredOverview} numberOfLines={2}>
              {featuredMovie.overview}
            </Text>
          ) : null}

          <View style={styles.featuredActions}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => handleMoviePress(featuredMovie)}
            >
              <Ionicons name="information-circle-outline" size={20} color={COLORS.text} />
              <Text style={styles.playText}>Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleFavoritePress(featuredMovie)}
            >
              <Ionicons
                name={favorites.has(featuredMovie.id) ? "heart" : "heart-outline"}
                size={22}
                color={favorites.has(featuredMovie.id) ? COLORS.primary : COLORS.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const MovieRow = ({ title, data }: { title: string; data: Movie[] }) => {
    if (!data.length) return null;

    return (
      <View style={styles.row}>
        <Text style={styles.rowTitle}>{title}</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={data.slice(0, 10)}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.rowList}
          renderItem={({ item }) => {
            const hasPoster = !!item.poster_path;
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => handleMoviePress(item)}
                activeOpacity={0.8}
              >
                {hasPoster ? (
                  <Image
                    source={{ uri: tmdb.getImageUrl(item.poster_path!, "medium") }}
                    style={styles.poster}
                  />
                ) : (
                  <View style={[styles.poster, styles.posterPlaceholder]}>
                    <Ionicons name="image-outline" size={28} color={COLORS.textMuted} />
                  </View>
                )}
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <View style={styles.cardMeta}>
                  <Ionicons name="star" size={10} color={COLORS.warning} />
                  <Text style={styles.cardRating}>
                    {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <>
            <Header />
            <Featured />
            <MovieRow title="Trending Now" data={trendingMovies} />
            <MovieRow title="Popular" data={popularMovies} />
            <MovieRow title="Now Playing" data={nowPlayingMovies} />
            <MovieRow title="Top Rated" data={topRatedMovies} />
            <View style={{ height: SPACING.xxl }} />
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={COLORS.primary}
            progressViewOffset={insets.top + 60}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: SPACING.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 12,
    zIndex: 10,
  },
  logo: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 2,
  },
  featured: {
    height: FEATURED_HEIGHT,
    justifyContent: "flex-end",
  },
  featuredGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  featuredContent: {
    padding: SPACING.lg,
  },
  featuredBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: SPACING.sm,
  },
  featuredBadgeText: {
    color: COLORS.warning,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  featuredTitle: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: "800",
    marginBottom: SPACING.xs,
    lineHeight: 36,
  },
  featuredOverview: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: SPACING.md,
  },
  featuredActions: {
    flexDirection: "row",
    gap: SPACING.md,
    alignItems: "center",
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.md,
    gap: 8,
  },
  playText: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 15,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    marginBottom: SPACING.lg,
  },
  rowTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  rowList: {
    paddingLeft: SPACING.md,
    paddingRight: SPACING.sm,
  },
  card: {
    marginRight: SPACING.sm,
    width: 120,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
  },
  posterPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "500",
    marginTop: SPACING.xs,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  cardRating: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: "600",
  },
});
