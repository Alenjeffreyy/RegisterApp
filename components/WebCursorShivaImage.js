import React, { useEffect, useRef } from "react";
import { Platform, StyleSheet, Animated } from "react-native";

export default function WebCursorShivaImage({ imageUri, size = 140, style, alt = "Lord Shiva" }) {
  if (Platform.OS !== "web") return null;
  if (!imageUri) return null;

  const cursorX = useRef(new Animated.Value(0)).current;
  const cursorY = useRef(new Animated.Value(0)).current;

  const maxTilt = 8; // degrees
  const rotateX = cursorY.interpolate({ inputRange: [-1, 1], outputRange: ["8deg", "-8deg"] });
  const rotateY = cursorX.interpolate({ inputRange: [-1, 1], outputRange: ["-8deg", "8deg"] });

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const handle = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      Animated.spring(cursorX, {
        toValue: nx,
        stiffness: 120,
        damping: 18,
        mass: 0.8,
        useNativeDriver: false,
      }).start();
      Animated.spring(cursorY, {
        toValue: ny,
        stiffness: 120,
        damping: 18,
        mass: 0.8,
        useNativeDriver: false,
      }).start();
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [cursorX, cursorY]);

  const width = size;
  const height = size;

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          width,
          height,
          transform: [{ perspective: 800 }, { rotateX }, { rotateY }],
        },
      ]}
      pointerEvents="none"
    >
      {/* Use a native <img> for crisp rendering on web */}
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img
        src={imageUri}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: Math.max(10, size * 0.18),
          boxShadow: "0 10px 28px rgba(0,0,0,0.35)",
          userSelect: "none",
          pointerEvents: "none",
        }}
        decoding="async"
        loading="eager"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
});
