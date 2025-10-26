import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { mealApiService } from "@/services/meal-api";
import { homeStyles } from "@/assets/styles/home.styles";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/color";
import CategoryFilter from "@/components/category-filter";
import RecipeCard from "@/components/recipe-card";
// Type definitions
interface Category {
  id: number;
  name: string;
  image: string;
  description: string;
}

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  [key: string]: any; // For dynamic ingredient/measure properties
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
const HomeScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<TransformedMeal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featureRecipe, setFeatureRecipe] = useState<TransformedMeal | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const [categories, featureMeals] = await Promise.all([
        mealApiService.getCategories(),
        mealApiService.getRandomMeals(12),
      ]);

      const transformedCategories = categories.map((c: any, i: number) => ({
        id: i + 1,
        name: c.strCategory,
        image: c.strCategoryThumb,
        description: c.strCategoryDescription,
      }));

      setCategories(transformedCategories);
      if (!selectedCategory) {
        const firstCategory = transformedCategories[0].name;
        setSelectedCategory(firstCategory);
        // Load recipes from the first category instead of random meals
        await loadCategoryData(firstCategory);
      }

      // Fix: featureMeals is already an array, so we can map over it
      const transformedFeaturedMeals = featureMeals
        .map((meal: Meal) => mealApiService.transformMealData(meal))
        .filter((meal: TransformedMeal | null) => meal !== null);

      // Set the first featured meal as the feature recipe
      if (transformedFeaturedMeals.length > 0) {
        setFeatureRecipe(transformedFeaturedMeals[0]);
      }
    } catch (error) {
      console.error("Error loading data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryData = async (category: string) => {
    try {
      const meals = await mealApiService.filterByCategory(category);
      const transformedMeals = meals
        .map((meal: Meal) => mealApiService.transformMealData(meal))
        .filter((meal: TransformedMeal | null) => meal !== null);
      setRecipes(transformedMeals);
    } catch (error) {
      console.error("Error loading category data: ", error);
      setRecipes([]);
    }
  };

  const handleCategorySelection = async (category: string) => {
    setSelectedCategory(category);
    await loadCategoryData(category);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (selectedCategory) {
      // Refresh with the currently selected category
      await loadCategoryData(selectedCategory);
    } else {
      // Fallback to loading initial data if no category is selected
      await loadData();
    }
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={homeStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={homeStyles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Animal Icons */}
        <View style={homeStyles.welcomeSection}>
          <Image
            source={require("@/assets/images/lamb.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />
          <Image
            source={require("@/assets/images/chicken.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />
          <Image
            source={require("@/assets/images/pork.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />
        </View>
        {/* Featured section  */}
        {featureRecipe && (
          <View style={homeStyles.featuredSection}>
            <TouchableOpacity
              style={homeStyles.featuredCard}
              activeOpacity={0.9}
              onPress={() => router.push(`/recipe/${featureRecipe}`)}
            >
              <View style={homeStyles.featuredImageContainer}>
                <Image
                  source={{ uri: featureRecipe.image }}
                  style={homeStyles.featuredImage}
                  contentFit="cover"
                  transition={500}
                />
                <View style={homeStyles.featuredOverlay}>
                  <View style={homeStyles.featuredBadge}>
                    <Text style={homeStyles.featuredBadgeText}>Featured</Text>
                  </View>
                  <View style={homeStyles.featuredContent}>
                    <Text style={homeStyles.featuredTitle} numberOfLines={2}>
                      {featureRecipe.title}
                    </Text>
                    <View style={homeStyles.featuredMeta}>
                      <View style={homeStyles.metaItem}>
                        <Ionicons
                          name="time-outline"
                          size={16}
                          color={COLORS.white}
                        />
                        <Text style={homeStyles.metaText}>
                          {featureRecipe.cookTime}
                        </Text>
                      </View>
                      <View style={homeStyles.metaItem}>
                        <Ionicons
                          name="people-outline"
                          size={16}
                          color={COLORS.white}
                        />
                        <Text style={homeStyles.metaText}>
                          {featureRecipe.servings}
                        </Text>
                      </View>
                      <View style={homeStyles.metaItem}>
                        <Ionicons
                          name="location-outline"
                          size={16}
                          color={COLORS.white}
                        />
                        <Text style={homeStyles.metaText}>
                          {featureRecipe.area}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelection}
          />
        )}
        <View style={homeStyles.recipesSection}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>{selectedCategory}</Text>
          </View>
          <FlatList
            data={recipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={homeStyles.row}
            contentContainerStyle={homeStyles.recipesGrid}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={homeStyles.emptyState}>
                <Ionicons
                  name="restaurant-outline"
                  size={64}
                  color={COLORS.textLight}
                />
                <Text style={homeStyles.emptyTitle}>No recipes found</Text>
                <Text style={homeStyles.emptyDescription}>
                  Try a different category.
                </Text>
              </View>
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
