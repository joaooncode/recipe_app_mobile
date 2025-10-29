import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFavorites } from "@/hooks/useFavorites";
import { favoritesStyles } from "@/assets/styles/favorites.styles";
import { COLORS } from "@/constants/color";
import RecipeCard from "@/components/recipe-card";
import SafeScreen from "@/components/SafeScreen";

const FavoritesScreen = () => {
  const router = useRouter();
  const { favorites, loading, loadFavorites } = useFavorites();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const handleExploreRecipes = () => {
    router.push("/(tabs)");
  };

  const renderEmptyState = () => (
    <View style={favoritesStyles.emptyState}>
      <View style={favoritesStyles.emptyIconContainer}>
        <Ionicons name="heart-outline" size={48} color={COLORS.textLight} />
      </View>
      <Text style={favoritesStyles.emptyTitle}>No Favorites Yet</Text>
      <Text style={favoritesStyles.emptyDescription}>
        Start exploring recipes and add them to your favorites{"\n"}to see them
        here!
      </Text>
      <TouchableOpacity
        style={favoritesStyles.exploreButton}
        onPress={handleExploreRecipes}
        activeOpacity={0.8}
      >
        <Ionicons name="restaurant-outline" size={20} color={COLORS.white} />
        <Text style={favoritesStyles.exploreButtonText}>Explore Recipes</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeScreen>
        <View style={favoritesStyles.container}>
          <View style={favoritesStyles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={favoritesStyles.emptyDescription}>
              Loading favorites...
            </Text>
          </View>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <View style={favoritesStyles.container}>
        {/* Header */}
        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.title}>My Favorites</Text>
        </View>

        {/* Stats Section */}
        {favorites.length > 0 && (
          <View style={favoritesStyles.statsContainer}>
            <View style={favoritesStyles.statCard}>
              <View
                style={[
                  favoritesStyles.statIcon,
                  { backgroundColor: COLORS.primary },
                ]}
              >
                <Ionicons name="heart" size={20} color={COLORS.white} />
              </View>
              <Text style={favoritesStyles.statValue}>{favorites.length}</Text>
              <Text style={favoritesStyles.emptyDescription}>
                {favorites.length === 1
                  ? "Favorite Recipe"
                  : "Favorite Recipes"}
              </Text>
            </View>
          </View>
        )}

        {/* Recipes Section */}
        <View style={favoritesStyles.recipesSection}>
          <FlatList
            data={favorites}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={favoritesStyles.row}
            contentContainerStyle={favoritesStyles.recipesGrid}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={COLORS.primary}
              />
            }
            ListEmptyComponent={renderEmptyState()}
          />
        </View>
      </View>
    </SafeScreen>
  );
};

export default FavoritesScreen;
