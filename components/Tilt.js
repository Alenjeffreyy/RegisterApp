import React, { useRef, useState } from "react";
import { Platform, Animated, StyleSheet } from "react-native";

// Cross-platform tilt wrapper. On web, tilts toward the cursor. On native, scales on touch.
export default function Tilt({
  children,
  style,
  tiltMaxDeg = 12,
  scaleOnHover = 1.03,
  disabled = false,
}) {
  const tiltX = useRef(new Animated.Value(0)).current; // normalized -1..1
  const tiltY = useRef(new Animated.Value(0)).current; // normalized -1..1
  const scale = useRef(new Animated.Value(1)).current;
  const [box, setBox] = useState({ width: 0, height: 0 });

  const animateTo = (x, y) => {
    Animated.spring(tiltX, { toValue: x, stiffness: 140, damping: 16, mass: 0.9, useNativeDriver: false }).start();
    Animated.spring(tiltY, { toValue: y, stiffness: 140, damping: 16, mass: 0.9, useNativeDriver: false }).start();
  };

  const handleMouseMove = (e) => {
    if (disabled || Platform.OS !== "web") return;
    const { locationX, locationY } = e.nativeEvent;
    if (!box.width || !box.height) return;
    const pctX = Math.max(0, Math.min(1, locationX / box.width));
    const pctY = Math.max(0, Math.min(1, locationY / box.height));
    const nx = pctX * 2 - 1; // -1..1
    const ny = (1 - pctY) * 2 - 1; // -1..1 (invert Y for natural tilt)
    animateTo(nx, ny);
  };

  const handleEnter = () => {
    if (disabled) return;
    Animated.spring(scale, { toValue: scaleOnHover, stiffness: 180, damping: 18, mass: 0.9, useNativeDriver: true }).start();
  };
  const handleLeave = () => {
    if (disabled) return;
    Animated.spring(scale, { toValue: 1, stiffness: 180, damping: 18, mass: 0.9, useNativeDriver: true }).start();
    animateTo(0, 0);
  };

  const handleTouchStart = () => {
    if (disabled) return;
    Animated.spring(scale, { toValue: 0.98, stiffness: 200, damping: 20, mass: 1, useNativeDriver: true }).start();
  };
  const handleTouchEnd = () => {
    if (disabled) return;
    Animated.spring(scale, { toValue: 1, stiffness: 200, damping: 20, mass: 1, useNativeDriver: true }).start();
  };

  const rotateX = tiltY.interpolate({ inputRange: [-1, 1], outputRange: [`${tiltMaxDeg}deg`, `-${tiltMaxDeg}deg`] });
  const rotateY = tiltX.interpolate({ inputRange: [-1, 1], outputRange: [`-${tiltMaxDeg}deg`, `${tiltMaxDeg}deg`] });

  return (
    <Animated.View
      onLayout={(e) => setBox({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
      onMouseMove={Platform.OS === "web" ? handleMouseMove : undefined}
      onMouseEnter={Platform.OS === "web" ? handleEnter : undefined}
      onMouseLeave={Platform.OS === "web" ? handleLeave : undefined}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={[
        style,
        styles.container,
        { transform: [{ perspective: 800 }, { rotateX }, { rotateY }, { scale }] },
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    willChange: "transform",
  },
});
