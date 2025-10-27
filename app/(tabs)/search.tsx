import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { mealApiService } from "@/services/meal-api";
import { searchStyles } from "@/assets/styles/search.styles";
import { COLORS } from "@/constants/color";
import RecipeCard from "@/components/recipe-card";
import SafeScreen from "@/components/SafeScreen";

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

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<TransformedMeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        performSearch(searchQuery.trim());
      } else {
        setResults([]);
        setHasSearched(false);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    try {
      setLoading(true);
      setHasSearched(true);

      const meals = await mealApiService.searchMealByName(query);

      if (meals && meals.length > 0) {
        const transformedMeals = meals
          .map((meal: Meal) => mealApiService.transformMealData(meal))
          .filter((meal: TransformedMeal | null) => meal !== null);
        setResults(transformedMeals);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error searching meals:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setResults([]);
    setHasSearched(false);
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={searchStyles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={searchStyles.emptyDescription}>Searching...</Text>
        </View>
      );
    }

    if (!hasSearched) {
      return (
        <View style={searchStyles.emptyState}>
          <Ionicons name="search-outline" size={64} color={COLORS.textLight} />
          <Text style={searchStyles.emptyTitle}>Search for Recipes</Text>
          <Text style={searchStyles.emptyDescription}>
            Start typing to find your favorite recipes{"\n"}by meal name
          </Text>
        </View>
      );
    }

    if (hasSearched && results.length === 0) {
      return (
        <View style={searchStyles.emptyState}>
          <Ionicons name="sad-outline" size={64} color={COLORS.textLight} />
          <Text style={searchStyles.emptyTitle}>No Recipes Found</Text>
          <Text style={searchStyles.emptyDescription}>
            Try searching with different keywords{"\n"}or check your spelling
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeScreen>
      <View style={searchStyles.container}>
        {/* Search Input Section */}
        <View style={searchStyles.searchSection}>
          <View style={searchStyles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={COLORS.textLight}
              style={searchStyles.searchIcon}
            />
            <TextInput
              style={searchStyles.searchInput}
              placeholder="Search recipes..."
              placeholderTextColor={COLORS.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={handleClearSearch}
                style={searchStyles.clearButton}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Results Section */}
        <View style={searchStyles.resultsSection}>
          {results.length > 0 && !loading && (
            <View style={searchStyles.resultsHeader}>
              <Text style={searchStyles.resultsTitle}>Search Results</Text>
              <Text style={searchStyles.resultsCount}>
                {results.length} {results.length === 1 ? "recipe" : "recipes"}
              </Text>
            </View>
          )}

          <FlatList
            data={results}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={searchStyles.row}
            contentContainerStyle={searchStyles.recipesGrid}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState()}
          />
        </View>
      </View>
    </SafeScreen>
  );
};

export default SearchScreen;
