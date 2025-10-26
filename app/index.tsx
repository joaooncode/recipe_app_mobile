import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { View, Text } from "react-native";
import { COLORS } from "@/constants/color";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading screen while Clerk is loading
  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        }}
      >
        <Text>Loading...</Text>
      </View>
    );
  }

  // Redirect based on authentication state
  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/(auth)/sign-in" />;
  }
}
