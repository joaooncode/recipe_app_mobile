import AsyncStorage from "@react-native-async-storage/async-storage";

// Type definitions
interface TransformedMeal {
  id: string;
  title: string;
  description: string;
  image: string;
  cookTime: string;
  servings: number;
  category: string;
  area: string;
  ingredients: string[];
  instructions: string[];
  originalData: any;
}

export const favoritesService = {
  // Get all favorites for a user
  getFavorites: async (userId: string): Promise<TransformedMeal[]> => {
    try {
      const key = `@favorites_${userId}`;
      const favoritesJson = await AsyncStorage.getItem(key);

      if (favoritesJson) {
        return JSON.parse(favoritesJson);
      }
      return [];
    } catch (error) {
      console.error("Error getting favorites:", error);
      return [];
    }
  },

  // Add a recipe to favorites
  addFavorite: async (
    userId: string,
    recipe: TransformedMeal
  ): Promise<boolean> => {
    try {
      const key = `@favorites_${userId}`;
      const existingFavorites = await favoritesService.getFavorites(userId);

      // Check if recipe is already favorited
      const isAlreadyFavorited = existingFavorites.some(
        (fav) => fav.id === recipe.id
      );

      if (isAlreadyFavorited) {
        return false; // Already favorited
      }

      const updatedFavorites = [...existingFavorites, recipe];
      await AsyncStorage.setItem(key, JSON.stringify(updatedFavorites));
      return true;
    } catch (error) {
      console.error("Error adding favorite:", error);
      return false;
    }
  },

  // Remove a recipe from favorites
  removeFavorite: async (
    userId: string,
    recipeId: string
  ): Promise<boolean> => {
    try {
      const key = `@favorites_${userId}`;
      const existingFavorites = await favoritesService.getFavorites(userId);

      const updatedFavorites = existingFavorites.filter(
        (fav) => fav.id !== recipeId
      );

      await AsyncStorage.setItem(key, JSON.stringify(updatedFavorites));
      return true;
    } catch (error) {
      console.error("Error removing favorite:", error);
      return false;
    }
  },

  // Check if a recipe is favorited
  isFavorite: async (userId: string, recipeId: string): Promise<boolean> => {
    try {
      const favorites = await favoritesService.getFavorites(userId);
      return favorites.some((fav) => fav.id === recipeId);
    } catch (error) {
      console.error("Error checking favorite status:", error);
      return false;
    }
  },

  // Toggle favorite status (add if not favorited, remove if favorited)
  toggleFavorite: async (
    userId: string,
    recipe: TransformedMeal
  ): Promise<boolean> => {
    try {
      const isFavorited = await favoritesService.isFavorite(userId, recipe.id);

      if (isFavorited) {
        return await favoritesService.removeFavorite(userId, recipe.id);
      } else {
        return await favoritesService.addFavorite(userId, recipe);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      return false;
    }
  },
};
