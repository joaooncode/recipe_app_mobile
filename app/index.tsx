import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { View, Text } from "react-native";
import { COLORS } from "@/constants/color";
import { useEffect } from "react";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log(
      "Auth state changed - isLoaded:",
      isLoaded,
      "isSignedIn:",
      isSignedIn
    );
    if (isLoaded) {
      if (isSignedIn) {
        console.log("User is signed in, redirecting to tabs...");
        router.replace("/(tabs)");
      } else {
        console.log("User is not signed in, redirecting to sign-in...");
        router.replace("/(auth)/sign-in");
      }
    }
  }, [isLoaded, isSignedIn, router]);

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

  // Show loading while redirecting
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <Text>Redirecting...</Text>
    </View>
  );
}
