import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { mealApiService } from "@/services/meal-api";
import { useFavorites } from "@/hooks/useFavorites";
import { recipeDetailStyles } from "@/assets/styles/recipe-detail.styles";
import { COLORS } from "@/constants/color";
import SafeScreen from "@/components/SafeScreen";
import { useUser } from "@clerk/clerk-expo";

// Type definitions
interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  [key: string]: any;
}

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
  originalData: Meal;
}

const RecipeDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [recipe, setRecipe] = useState<TransformedMeal | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const loadRecipe = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const meal = await mealApiService.getMealById(id as string);

      if (meal) {
        const transformedMeal = mealApiService.transformMealData(meal);
        if (transformedMeal) {
          setRecipe(transformedMeal);

          // Check if recipe is favorited
          if (user?.id) {
            const favorited = isFavorite(transformedMeal.id);
            // Note: isFavorite is now a function from the hook, no need to await
          }
        }
      }
    } catch (error) {
      console.error("Error loading recipe:", error);
      Alert.alert("Error", "Failed to load recipe details");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user?.id || !recipe) return;

    try {
      setFavoriteLoading(true);
      const success = await toggleFavorite(recipe);

      if (!success) {
        Alert.alert("Error", "Failed to update favorite");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Alert.alert("Error", "Failed to update favorite");
    } finally {
      setFavoriteLoading(false);
    }
  };

  useEffect(() => {
    loadRecipe();
  }, [id]);

  if (loading) {
    return (
      <SafeScreen>
        <View style={recipeDetailStyles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading recipe...</Text>
          </View>
        </View>
      </SafeScreen>
    );
  }

  if (!recipe) {
    return (
      <SafeScreen>
        <View style={recipeDetailStyles.container}>
          <View style={recipeDetailStyles.errorContainer}>
            <View style={recipeDetailStyles.errorContent}>
              <Ionicons
                name="alert-circle-outline"
                size={64}
                color={COLORS.textLight}
              />
              <Text style={recipeDetailStyles.errorTitle}>
                Recipe Not Found
              </Text>
              <Text style={recipeDetailStyles.errorDescription}>
                The recipe you're looking for doesn't exist or has been removed.
              </Text>
              <TouchableOpacity
                style={recipeDetailStyles.errorButton}
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <Text style={recipeDetailStyles.errorButtonText}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <View style={recipeDetailStyles.container}>
        {/* Header with Image */}
        <View style={recipeDetailStyles.headerContainer}>
          <View style={recipeDetailStyles.imageContainer}>
            <Image
              source={{ uri: recipe.image }}
              style={recipeDetailStyles.headerImage}
              contentFit="cover"
              transition={500}
            />
          </View>

          {/* Floating Buttons */}
          <View style={recipeDetailStyles.floatingButtons}>
            <TouchableOpacity
              style={recipeDetailStyles.floatingButton}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={recipeDetailStyles.floatingButton}
              onPress={handleToggleFavorite}
              disabled={favoriteLoading}
              activeOpacity={0.8}
            >
              {favoriteLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Ionicons
                  name={
                    recipe && isFavorite(recipe.id) ? "heart" : "heart-outline"
                  }
                  size={24}
                  color={
                    recipe && isFavorite(recipe.id)
                      ? COLORS.primary
                      : COLORS.white
                  }
                />
              )}
            </TouchableOpacity>
          </View>

          {/* Title Section */}
          <View style={recipeDetailStyles.titleSection}>
            <View style={recipeDetailStyles.categoryBadge}>
              <Text style={recipeDetailStyles.categoryText}>
                {recipe.category}
              </Text>
            </View>
            <Text style={recipeDetailStyles.recipeTitle}>{recipe.title}</Text>
            <View style={recipeDetailStyles.locationRow}>
              <Ionicons
                name="location-outline"
                size={16}
                color={COLORS.white}
              />
              <Text style={recipeDetailStyles.locationText}>{recipe.area}</Text>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <ScrollView
          style={recipeDetailStyles.contentSection}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Stats */}
          <View style={recipeDetailStyles.statsContainer}>
            <View style={recipeDetailStyles.statCard}>
              <View
                style={[
                  recipeDetailStyles.statIconContainer,
                  { backgroundColor: COLORS.primary + "20" },
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={COLORS.primary}
                />
              </View>
              <Text style={recipeDetailStyles.statValue}>
                {recipe.cookTime}
              </Text>
              <Text style={recipeDetailStyles.statLabel}>Cook Time</Text>
            </View>
            <View style={recipeDetailStyles.statCard}>
              <View
                style={[
                  recipeDetailStyles.statIconContainer,
                  { backgroundColor: COLORS.primary + "20" },
                ]}
              >
                <Ionicons
                  name="people-outline"
                  size={20}
                  color={COLORS.primary}
                />
              </View>
              <Text style={recipeDetailStyles.statValue}>
                {recipe.servings}
              </Text>
              <Text style={recipeDetailStyles.statLabel}>Servings</Text>
            </View>
          </View>

          {/* Ingredients Section */}
          <View style={recipeDetailStyles.sectionContainer}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <View
                style={[
                  recipeDetailStyles.sectionIcon,
                  { backgroundColor: COLORS.primary + "20" },
                ]}
              >
                <Ionicons
                  name="list-outline"
                  size={16}
                  color={COLORS.primary}
                />
              </View>
              <Text style={recipeDetailStyles.sectionTitle}>Ingredients</Text>
              <View style={recipeDetailStyles.countBadge}>
                <Text style={recipeDetailStyles.countText}>
                  {recipe.ingredients.length}
                </Text>
              </View>
            </View>
            <View style={recipeDetailStyles.ingredientsGrid}>
              {recipe.ingredients.map((ingredient, index) => (
                <View key={index} style={recipeDetailStyles.ingredientCard}>
                  <View style={recipeDetailStyles.ingredientNumber}>
                    <Text style={recipeDetailStyles.ingredientNumberText}>
                      {index + 1}
                    </Text>
                  </View>
                  <Text style={recipeDetailStyles.ingredientText}>
                    {ingredient}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Instructions Section */}
          <View style={recipeDetailStyles.sectionContainer}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <View
                style={[
                  recipeDetailStyles.sectionIcon,
                  { backgroundColor: COLORS.primary + "20" },
                ]}
              >
                <Ionicons
                  name="book-outline"
                  size={16}
                  color={COLORS.primary}
                />
              </View>
              <Text style={recipeDetailStyles.sectionTitle}>Instructions</Text>
              <View style={recipeDetailStyles.countBadge}>
                <Text style={recipeDetailStyles.countText}>
                  {recipe.instructions.length}
                </Text>
              </View>
            </View>
            <View style={recipeDetailStyles.instructionsContainer}>
              {recipe.instructions.map((instruction, index) => (
                <View key={index} style={recipeDetailStyles.instructionCard}>
                  <View
                    style={[
                      recipeDetailStyles.stepIndicator,
                      { backgroundColor: COLORS.primary },
                    ]}
                  >
                    <Text style={recipeDetailStyles.stepNumber}>
                      {index + 1}
                    </Text>
                  </View>
                  <View style={recipeDetailStyles.instructionContent}>
                    <Text style={recipeDetailStyles.instructionText}>
                      {instruction}
                    </Text>
                    <View style={recipeDetailStyles.instructionFooter}>
                      <Text style={recipeDetailStyles.stepLabel}>
                        Step {index + 1}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeScreen>
  );
};

export default RecipeDetailScreen;

// Additional styles for components not in the main stylesheet
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 16,
  },
});
