import React, { useEffect, useMemo, useRef } from "react";
import { Platform, StyleSheet, Animated } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  G,
  Rect,
  Circle,
  Ellipse,
  Path,
} from "react-native-svg";

export default function WebCursorShiva({ size = 140, style }) {
  if (Platform.OS !== "web") return null;

  const cursorX = useRef(new Animated.Value(0)).current;
  const cursorY = useRef(new Animated.Value(0)).current;

  const pupilOffsetX = Animated.multiply(cursorX, size * 0.05);
  const pupilOffsetY = Animated.multiply(cursorY, size * 0.035);

  const leftEyeBase = useMemo(
    () => ({ x: size * 0.38, y: size * 0.48 }),
    [size]
  );
  const rightEyeBase = useMemo(
    () => ({ x: size * 0.62, y: size * 0.48 }),
    [size]
  );

  const leftEyeCx = Animated.add(new Animated.Value(leftEyeBase.x), pupilOffsetX);
  const leftEyeCy = Animated.add(new Animated.Value(leftEyeBase.y), pupilOffsetY);
  const rightEyeCx = Animated.add(new Animated.Value(rightEyeBase.x), pupilOffsetX);
  const rightEyeCy = Animated.add(new Animated.Value(rightEyeBase.y), pupilOffsetY);

  const maxTilt = 10; // degrees
  const rotateX = cursorY.interpolate({
    inputRange: [-1, 1],
    outputRange: [`${maxTilt}deg`, `-${maxTilt}deg`],
  });
  const rotateY = cursorX.interpolate({
    inputRange: [-1, 1],
    outputRange: [`-${maxTilt}deg`, `${maxTilt}deg`],
  });

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
  const headRadius = size * 0.42;

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        { width, height, transform: [{ perspective: 800 }, { rotateX }, { rotateY }] },
      ]}
      pointerEvents="none"
    >
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="faceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#ffe7d1" />
            <Stop offset="100%" stopColor="#ffd9b3" />
          </LinearGradient>
          <LinearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#1f2937" />
            <Stop offset="100%" stopColor="#0f172a" />
          </LinearGradient>
          <LinearGradient id="tilakGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#ef4444" />
            <Stop offset="100%" stopColor="#dc2626" />
          </LinearGradient>
          <LinearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#34d399" />
            <Stop offset="100%" stopColor="#10b981" />
          </LinearGradient>
        </Defs>

        {/* hair bun */}
        <G>
          <Circle cx={width * 0.5} cy={height * 0.12} r={size * 0.12} fill="url(#hairGrad)" />
          <Path
            d={`M ${width * 0.3} ${height * 0.22} Q ${width * 0.5} ${height * 0.06}, ${width * 0.7} ${height * 0.22}`}
            stroke="#0f172a"
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
            opacity={0.9}
          />
        </G>

        {/* head */}
        <G>
          <Rect
            x={width * 0.1}
            y={height * 0.22}
            width={width * 0.8}
            height={height * 0.68}
            rx={headRadius}
            ry={headRadius}
            fill="url(#faceGrad)"
          />
          {/* side hair */}
          <Path
            d={`M ${width * 0.1} ${height * 0.28} Q ${width * 0.08} ${height * 0.55}, ${width * 0.18} ${height * 0.84}`}
            stroke="url(#hairGrad)"
            strokeWidth={size * 0.08}
            strokeLinecap="round"
            opacity={0.95}
          />
          <Path
            d={`M ${width * 0.9} ${height * 0.28} Q ${width * 0.92} ${height * 0.55}, ${width * 0.82} ${height * 0.84}`}
            stroke="url(#hairGrad)"
            strokeWidth={size * 0.08}
            strokeLinecap="round"
            opacity={0.95}
          />
        </G>

        {/* tilak / third eye */}
        <G>
          <Rect
            x={width * 0.42}
            y={height * 0.36}
            width={width * 0.16}
            height={height * 0.018}
            rx={3}
            fill="url(#tilakGrad)"
          />
          <Rect
            x={width * 0.42}
            y={height * 0.39}
            width={width * 0.16}
            height={height * 0.018}
            rx={3}
            fill="url(#tilakGrad)"
          />
          <Ellipse cx={width * 0.5} cy={height * 0.375} rx={width * 0.026} ry={height * 0.014} fill="#ef4444" />
        </G>

        {/* eyes */}
        <G>
          <Circle cx={leftEyeBase.x} cy={leftEyeBase.y} r={size * 0.085} fill="#ffffff" />
          <Circle cx={rightEyeBase.x} cy={rightEyeBase.y} r={size * 0.085} fill="#ffffff" />
          <AnimatedCircle cx={leftEyeCx} cy={leftEyeCy} r={size * 0.032} fill="#111827" />
          <AnimatedCircle cx={rightEyeCx} cy={rightEyeCy} r={size * 0.032} fill="#111827" />
        </G>

        {/* nose and subtle smile */}
        <G opacity={0.7}>
          <Path
            d={`M ${width * 0.5} ${height * 0.52} Q ${width * 0.48} ${height * 0.6}, ${width * 0.52} ${height * 0.62}`}
            stroke="#9ca3af"
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d={`M ${width * 0.40} ${height * 0.72} Q ${width * 0.5} ${height * 0.78}, ${width * 0.60} ${height * 0.72}`}
            stroke="#9ca3af"
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
        </G>

        {/* trident accent */}
        <G opacity={0.9}>
          <Path
            d={`M ${width * 0.88} ${height * 0.22} L ${width * 0.88} ${height * 0.06}`}
            stroke="url(#accentGrad)"
            strokeWidth={3}
            strokeLinecap="round"
          />
          <Path
            d={`M ${width * 0.88} ${height * 0.06} Q ${width * 0.86} ${height * 0.02}, ${width * 0.84} ${height * 0.06}`}
            stroke="url(#accentGrad)"
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d={`M ${width * 0.88} ${height * 0.06} Q ${width * 0.90} ${height * 0.02}, ${width * 0.92} ${height * 0.06}`}
            stroke="url(#accentGrad)"
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
          />
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
