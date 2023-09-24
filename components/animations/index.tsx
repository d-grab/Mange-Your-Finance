import React, { useRef, useEffect } from "react";
import { Animated, Text, View } from "react-native";
import type { PropsWithChildren } from "react";
import type { ViewStyle } from "react-native";

export const FadeInView = ({
  children,
  _duration,
}: {
  children: any;
  _duration: number;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: _duration,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View // Special animatable View
      style={{
        opacity: fadeAnim, // Bind opacity to animated value
      }}
    >
      {children}
    </Animated.View>
  );
};
