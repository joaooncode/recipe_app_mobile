import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import SplashScreen from "@/components/SplashScreen";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [splashComplete, setSplashComplete] = useState(false);

  const handleSplashComplete = () => {
    setSplashComplete(true);
  };

  useEffect(() => {
    console.log(
      "Auth state changed - isLoaded:",
      isLoaded,
      "isSignedIn:",
      isSignedIn,
      "splashComplete:",
      splashComplete
    );
    if (isLoaded && splashComplete) {
      if (isSignedIn) {
        console.log("User is signed in, redirecting to tabs...");
        router.replace("/(tabs)");
      } else {
        console.log("User is not signed in, redirecting to sign-in...");
        router.replace("/(auth)/sign-in");
      }
    }
  }, [isLoaded, isSignedIn, splashComplete, router]);

  // Show splash screen while loading or before splash animation completes
  if (!isLoaded || !splashComplete) {
    return <SplashScreen onAnimationComplete={handleSplashComplete} />;
  }

  // This should not be reached as we redirect in useEffect
  return null;
}
