import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/clerk-expo";
import { favoritesService } from "../services/favorites-service";

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

export const useFavorites = () => {
  const { user } = useUser();
  const [favorites, setFavorites] = useState<TransformedMeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load favorites
  const loadFavorites = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const userFavorites = await favoritesService.getFavorites(user.id);
      setFavorites(userFavorites);
    } catch (err) {
      console.error("Error loading favorites:", err);
      setError("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Add favorite
  const addFavorite = useCallback(
    async (recipe: TransformedMeal) => {
      if (!user?.id) return false;

      try {
        setError(null);
        const success = await favoritesService.addFavorite(user.id, recipe);
        if (success) {
          setFavorites((prev) => [...prev, recipe]);
        }
        return success;
      } catch (err) {
        console.error("Error adding favorite:", err);
        setError("Failed to add favorite");
        return false;
      }
    },
    [user?.id]
  );

  // Remove favorite
  const removeFavorite = useCallback(
    async (recipeId: string) => {
      if (!user?.id) return false;

      try {
        setError(null);
        const success = await favoritesService.removeFavorite(
          user.id,
          recipeId
        );
        if (success) {
          setFavorites((prev) => prev.filter((fav) => fav.id !== recipeId));
        }
        return success;
      } catch (err) {
        console.error("Error removing favorite:", err);
        setError("Failed to remove favorite");
        return false;
      }
    },
    [user?.id]
  );

  // Toggle favorite
  const toggleFavorite = useCallback(
    async (recipe: TransformedMeal) => {
      if (!user?.id) return false;

      try {
        setError(null);
        const success = await favoritesService.toggleFavorite(user.id, recipe);
        if (success) {
          // Refresh favorites to get the updated state
          await loadFavorites();
        }
        return success;
      } catch (err) {
        console.error("Error toggling favorite:", err);
        setError("Failed to toggle favorite");
        return false;
      }
    },
    [user?.id, loadFavorites]
  );

  // Check if recipe is favorited
  const isFavorite = useCallback(
    (recipeId: string) => {
      return favorites.some((fav) => fav.id === recipeId);
    },
    [favorites]
  );

  // Load favorites on mount and when user changes
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    loading,
    error,
    loadFavorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
};
