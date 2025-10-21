import React, { useEffect, useMemo, useRef } from "react";
import { Platform, View, StyleSheet, Animated } from "react-native";
import Svg, { Defs, LinearGradient, Stop, G, Rect, Circle, Path } from "react-native-svg";

// Web-only floating robot head whose eyes follow the cursor
export default function WebCursorRobot({ size = 140, style }) {
  if (Platform.OS !== "web") return null;

  // Normalized cursor position in the viewport [-1, 1]
  const cursorX = useRef(new Animated.Value(0)).current;
  const cursorY = useRef(new Animated.Value(0)).current;

  // Pupils offset in pixels
  const pupilOffsetX = Animated.multiply(cursorX, size * 0.05); // ~7px at 140
  const pupilOffsetY = Animated.multiply(cursorY, size * 0.035); // ~5px at 140

  // Precompute static eye centers
  const leftEyeBase = useMemo(() => ({ x: size * 0.36, y: size * 0.44 }), [size]);
  const rightEyeBase = useMemo(() => ({ x: size * 0.64, y: size * 0.44 }), [size]);

  // Animated eye centers
  const leftEyeCx = Animated.add(new Animated.Value(leftEyeBase.x), pupilOffsetX);
  const leftEyeCy = Animated.add(new Animated.Value(leftEyeBase.y), pupilOffsetY);
  const rightEyeCx = Animated.add(new Animated.Value(rightEyeBase.x), pupilOffsetX);
  const rightEyeCy = Animated.add(new Animated.Value(rightEyeBase.y), pupilOffsetY);

  // Head tilt derived from cursor
  const maxTilt = 10; // deg
  const rotateX = cursorY.interpolate({ inputRange: [-1, 1], outputRange: [`${maxTilt}deg`, `-${maxTilt}deg`] });
  const rotateY = cursorX.interpolate({ inputRange: [-1, 1], outputRange: [`-${maxTilt}deg`, `${maxTilt}deg`] });

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const handle = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
      const ny = (e.clientY / window.innerHeight) * 2 - 1; // -1..1
      Animated.spring(cursorX, { toValue: nx, stiffness: 120, damping: 18, mass: 0.8, useNativeDriver: false }).start();
      Animated.spring(cursorY, { toValue: ny, stiffness: 120, damping: 18, mass: 0.8, useNativeDriver: false }).start();
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [cursorX, cursorY]);

  const headRadius = size * 0.44;
  const width = size;
  const height = size;

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  return (
    <Animated.View style={[styles.container, style, { width, height, transform: [{ perspective: 800 }, { rotateX }, { rotateY }] }]} pointerEvents="none">
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="headGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#f5f7fa" />
            <Stop offset="100%" stopColor="#e6ecf5" />
          </LinearGradient>
          <LinearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#1f2937" />
            <Stop offset="100%" stopColor="#111827" />
          </LinearGradient>
          <LinearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#34d399" />
            <Stop offset="100%" stopColor="#10b981" />
          </LinearGradient>
        </Defs>

        {/* Antenna */}
        <G opacity={0.9}>
          <Path d={`M ${width * 0.5} ${height * 0.06} L ${width * 0.5} ${height * 0.16}`} stroke="#10b981" strokeWidth={3} strokeLinecap="round" />
          <Circle cx={width * 0.5} cy={height * 0.045} r={4} fill="#10b981" />
        </G>

        {/* Head base */}
        <G>
          <Rect x={width * 0.08} y={height * 0.18} width={width * 0.84} height={height * 0.72} rx={headRadius} ry={headRadius} fill="url(#headGrad)" />
          <Rect x={width * 0.16} y={height * 0.32} width={width * 0.68} height={height * 0.46} rx={headRadius * 0.5} fill="url(#visorGrad)" />
          {/* Decorative side accents */}
          <Circle cx={width * 0.12} cy={height * 0.56} r={6} fill="url(#accentGrad)" />
          <Circle cx={width * 0.88} cy={height * 0.56} r={6} fill="url(#accentGrad)" />
        </G>

        {/* Eyes */}
        <G>
          <Circle cx={leftEyeBase.x} cy={leftEyeBase.y} r={size * 0.09} fill="#f9fafb" />
          <Circle cx={rightEyeBase.x} cy={rightEyeBase.y} r={size * 0.09} fill="#f9fafb" />

          <AnimatedCircle cx={leftEyeCx} cy={leftEyeCy} r={size * 0.035} fill="#111827" />
          <AnimatedCircle cx={rightEyeCx} cy={rightEyeCy} r={size * 0.035} fill="#111827" />
        </G>

        {/* Mouth line */}
        <Path d={`M ${width * 0.34} ${height * 0.7} Q ${width * 0.5} ${height * 0.76}, ${width * 0.66} ${height * 0.7}`} stroke="#9ca3af" strokeWidth={3} fill="none" strokeLinecap="round" />

        {/* Subtle highlights */}
        <G opacity={0.12}>
          <Circle cx={width * 0.32} cy={height * 0.28} r={10} fill="#fff" />
          <Circle cx={width * 0.72} cy={height * 0.26} r={8} fill="#fff" />
        </G>
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 16,
    right: 16,
  },
});
