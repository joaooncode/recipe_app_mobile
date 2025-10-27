import React, { useEffect, useRef } from "react";
import { View, Text, Image, Dimensions, Animated } from "react-native";
import { COLORS } from "@/constants/color";

const { width, height } = Dimensions.get("window");

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export default function SplashScreen({
  onAnimationComplete,
}: SplashScreenProps) {
  // Animation values using React Native's Animated API
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;

  // Floating elements
  const forkTranslateY = useRef(new Animated.Value(0)).current;
  const forkOpacity = useRef(new Animated.Value(0)).current;
  const chefHatTranslateY = useRef(new Animated.Value(0)).current;
  const chefHatOpacity = useRef(new Animated.Value(0)).current;
  const ingredient1TranslateY = useRef(new Animated.Value(0)).current;
  const ingredient1Opacity = useRef(new Animated.Value(0)).current;
  const ingredient2TranslateY = useRef(new Animated.Value(0)).current;
  const ingredient2Opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    const startAnimations = () => {
      // Background fade in
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // Logo animation
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 150,
          friction: 15,
          useNativeDriver: true,
        }),
      ]).start();

      // Floating elements appear with delay
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(forkOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(chefHatOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(ingredient1Opacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(ingredient2Opacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start();
      }, 400);

      // Continuous floating animation
      const createFloatingAnimation = (
        animatedValue: Animated.Value,
        duration: number
      ) => {
        const animate = () => {
          Animated.sequence([
            Animated.timing(animatedValue, {
              toValue: -15,
              duration: duration,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: duration,
              useNativeDriver: true,
            }),
          ]).start(() => animate());
        };
        animate();
      };

      createFloatingAnimation(forkTranslateY, 2000);
      createFloatingAnimation(chefHatTranslateY, 2500);
      createFloatingAnimation(ingredient1TranslateY, 1800);
      createFloatingAnimation(ingredient2TranslateY, 2200);

      // Complete animation after 3 seconds
      setTimeout(() => {
        onAnimationComplete();
      }, 3000);
    };

    startAnimations();
  }, [onAnimationComplete]);

  // Animated styles
  const logoAnimatedStyle = {
    transform: [{ scale: logoScale }],
    opacity: logoOpacity,
  };

  const backgroundAnimatedStyle = {
    opacity: backgroundOpacity,
  };

  const forkAnimatedStyle = {
    transform: [{ translateY: forkTranslateY }],
    opacity: forkOpacity,
  };

  const chefHatAnimatedStyle = {
    transform: [{ translateY: chefHatTranslateY }],
    opacity: chefHatOpacity,
  };

  const ingredient1AnimatedStyle = {
    transform: [{ translateY: ingredient1TranslateY }],
    opacity: ingredient1Opacity,
  };

  const ingredient2AnimatedStyle = {
    transform: [{ translateY: ingredient2TranslateY }],
    opacity: ingredient2Opacity,
  };

  return (
    <Animated.View style={[{ flex: 1 }, backgroundAnimatedStyle]}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        }}
      >
        {/* Main Logo */}
        <Animated.View style={logoAnimatedStyle}>
          <Image
            source={require("@/assets/images/new_logo_2.png")}
            style={{
              width: 200,
              height: 200,
              resizeMode: "contain",
            }}
          />
        </Animated.View>

        {/* Floating Fork */}
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: height * 0.25,
              right: width * 0.15,
            },
            forkAnimatedStyle,
          ]}
        >
          <Text style={{ fontSize: 40, color: COLORS.primary }}>🍴</Text>
        </Animated.View>

        {/* Floating Chef Hat */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: height * 0.2,
              left: width * 0.1,
            },
            chefHatAnimatedStyle,
          ]}
        >
          <Text style={{ fontSize: 35, color: COLORS.primary }}>👨‍🍳</Text>
        </Animated.View>

        {/* Floating Ingredient 1 */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: height * 0.35,
              right: width * 0.2,
            },
            ingredient1AnimatedStyle,
          ]}
        >
          <Text style={{ fontSize: 25, color: COLORS.textLight }}>🍳</Text>
        </Animated.View>

        {/* Floating Ingredient 2 */}
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: height * 0.35,
              left: width * 0.2,
            },
            ingredient2AnimatedStyle,
          ]}
        >
          <Text style={{ fontSize: 25, color: COLORS.textLight }}>⭐</Text>
        </Animated.View>

        {/* App Name */}
        <Animated.View
          style={[
            {
              marginTop: 20,
              opacity: logoOpacity,
            },
          ]}
        >
          <Text
            style={{
              fontSize: 16,
              color: COLORS.textLight,
              textAlign: "center",
              marginTop: 5,
            }}
          >
            Cooking made fun!
          </Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}
