import apiClient from "./api-client";

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

interface BackendFavorite {
  id: string;
  userId: string;
  recipeId: number;
  title: string;
  image?: string;
  cookTime?: string;
  servings?: string;
  createdAt: string;
}

// Transform mobile recipe format to backend format
const transformToBackendFormat = (recipe: TransformedMeal) => ({
  userId: "", // Will be set when calling the API
  recipeId: parseInt(recipe.id),
  title: recipe.title,
  image: recipe.image,
  cookTime: recipe.cookTime,
  servings: recipe.servings.toString(),
});

// Transform backend format to mobile recipe format
const transformFromBackendFormat = (
  backendFavorite: BackendFavorite
): TransformedMeal => ({
  id: backendFavorite.recipeId.toString(),
  title: backendFavorite.title,
  description: "", // Not stored in backend, will be empty
  image: backendFavorite.image || "",
  cookTime: backendFavorite.cookTime || "30 minutes",
  servings: parseInt(backendFavorite.servings || "4"),
  category: "", // Not stored in backend
  area: "", // Not stored in backend
  ingredients: [], // Not stored in backend
  instructions: [], // Not stored in backend
  originalData: {}, // Not stored in backend
});

export const favoritesService = {
  // Get all favorites for a user
  getFavorites: async (userId: string): Promise<TransformedMeal[]> => {
    try {
      const response = await apiClient.get(`/api/favorites/${userId}`);

      if (response.status === 404) {
        return [];
      }

      const backendFavorites: BackendFavorite[] = response.data;
      return backendFavorites.map(transformFromBackendFormat);
    } catch (error) {
      console.error("Error fetching favorites from backend:", error);
      throw new Error("Failed to fetch favorites");
    }
  },

  // Add a recipe to favorites
  addFavorite: async (
    userId: string,
    recipe: TransformedMeal
  ): Promise<boolean> => {
    try {
      const backendFormat = transformToBackendFormat(recipe);
      backendFormat.userId = userId;

      const response = await apiClient.post("/api/favorites", backendFormat);

      if (response.status === 201) {
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error adding favorite to backend:", error);
      throw new Error("Failed to add favorite");
    }
  },

  // Remove a recipe from favorites
  removeFavorite: async (
    userId: string,
    recipeId: string
  ): Promise<boolean> => {
    try {
      const response = await apiClient.delete(
        `/api/favorites/${userId}/${recipeId}`
      );

      if (response.status === 200) {
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error removing favorite from backend:", error);
      throw new Error("Failed to remove favorite");
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
