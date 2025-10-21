import React, { useEffect, useMemo, useRef } from "react";
import { View, StyleSheet, useWindowDimensions, Animated, Easing } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Rect, Circle, G, Line } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedLine = Animated.createAnimatedComponent(Line);

export default function StunningBackground({ children }) {
  const { width, height } = useWindowDimensions();

  // Twinkle drivers
  const twinkleA = useRef(new Animated.Value(0)).current;
  const twinkleB = useRef(new Animated.Value(0)).current;
  const twinkleC = useRef(new Animated.Value(0)).current;
  // Soft glow for constellation lines
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = (val, duration) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, { toValue: 1, duration, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
          Animated.timing(val, { toValue: 0, duration, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
        ])
      ).start();

    loop(twinkleA, 2600);
    loop(twinkleB, 3800);
    loop(twinkleC, 5200);

    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
        Animated.timing(glow, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
      ])
    ).start();
  }, [twinkleA, twinkleB, twinkleC, glow]);

  // Generate star positions and per-star animated size/opacity factors
  const stars = useMemo(() => {
    const count = Math.max(90, Math.min(180, Math.round((width * height) / 14000)));
    const out = [];
    for (let i = 0; i < count; i += 1) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const baseRadius = 0.6 + Math.random() * 1.6;
      const baseOpacity = 0.45 + Math.random() * 0.5;
      const group = i % 3;
      const radiusBase = new Animated.Value(baseRadius);
      const opacityBase = new Animated.Value(baseOpacity);
      const flicker = group === 0 ? twinkleA : group === 1 ? twinkleB : twinkleC;
      const size = Animated.multiply(radiusBase, flicker.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.15] }));
      const opacity = Animated.multiply(opacityBase, flicker.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }));
      out.push({ x, y, size, opacity });
    }
    return out;
  }, [width, height, twinkleA, twinkleB, twinkleC]);

  // A subtle constellation path (purely decorative)
  const constellationPoints = useMemo(() => {
    return [
      { x: width * 0.18, y: height * 0.22 },
      { x: width * 0.42, y: height * 0.35 },
      { x: width * 0.68, y: height * 0.28 },
      { x: width * 0.82, y: height * 0.12 },
      { x: width * 0.55, y: height * 0.58 },
      { x: width * 0.35, y: height * 0.72 },
    ];
  }, [width, height]);

  const constellationOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.08, 0.18] });

  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="bgNight" cx="50%" cy="50%" r="75%">
            <Stop offset="0%" stopColor="#0b1020" stopOpacity="1" />
            <Stop offset="100%" stopColor="#060914" stopOpacity="1" />
          </RadialGradient>
          <RadialGradient id="nebula" cx="20%" cy="70%" r="60%">
            <Stop offset="0%" stopColor="#7c3aed" stopOpacity="0.18" />
            <Stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Night sky base and soft nebula tint */}
        <Rect x={0} y={0} width={width} height={height} fill="url(#bgNight)" />
        <Rect x={0} y={0} width={width} height={height} fill="url(#nebula)" />

        {/* Starfield */}
        <G>
          {stars.map((s, idx) => (
            <AnimatedCircle key={`star-${idx}`} cx={s.x} cy={s.y} r={s.size} fill="#FFFFFF" opacity={s.opacity} />
          ))}
        </G>

        {/* Decorative constellation */}
        <G>
          {constellationPoints.map((p, idx) => {
            if (idx === constellationPoints.length - 1) return null;
            const next = constellationPoints[idx + 1];
            return (
              <AnimatedLine
                key={`line-${idx}`}
                x1={p.x}
                y1={p.y}
                x2={next.x}
                y2={next.y}
                stroke="#c4b5fd"
                strokeWidth={1}
                strokeOpacity={constellationOpacity}
              />
            );
          })}
          {constellationPoints.map((p, idx) => (
            <Circle key={`node-${idx}`} cx={p.x} cy={p.y} r={1.6} fill="#e9d5ff" opacity={0.35} />
          ))}
        </G>
      </Svg>

      {children ? <View style={styles.children}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  children: {
    flex: 1,
  },
});
