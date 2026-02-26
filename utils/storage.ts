import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteMovie } from '@/types/movie';

const FAVORITES_KEY = '@cinemate_favorites';

export const storage = {
  // Get all favorites
  async getFavorites(): Promise<FavoriteMovie[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  // Add to favorites
  async addFavorite(movie: FavoriteMovie): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      
      // Check if already exists
      if (favorites.some(fav => fav.id === movie.id)) {
        return false;
      }

      const newFavorite = { ...movie, addedAt: Date.now() };
      const updatedFavorites = [...favorites, newFavorite];
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      return false;
    }
  },

  // Remove from favorites
  async removeFavorite(movieId: number): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      const updatedFavorites = favorites.filter(fav => fav.id !== movieId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      return false;
    }
  },

  // Check if movie is favorite
  async isFavorite(movieId: number): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.some(fav => fav.id === movieId);
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  },

  // Get favorites count
  async getFavoritesCount(): Promise<number> {
    try {
      const favorites = await this.getFavorites();
      return favorites.length;
    } catch (error) {
      console.error('Error getting favorites count:', error);
      return 0;
    }
  },

  // Clear all favorites
  async clearFavorites(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(FAVORITES_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing favorites:', error);
      return false;
    }
  },
};