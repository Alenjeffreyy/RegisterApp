import React, { useEffect, useRef } from "react";
import { View, StyleSheet, useWindowDimensions, Animated, Easing } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Circle,
  G,
  Line,
} from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

export default function StunningBackground({ children }) {
  const { width, height } = useWindowDimensions();

  const a = useRef(new Animated.Value(0)).current;
  const b = useRef(new Animated.Value(0)).current;
  const c = useRef(new Animated.Value(0)).current;
  const shine = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = (val, duration) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, {
            toValue: 1,
            duration,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false,
          }),
          Animated.timing(val, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false,
          }),
        ])
      ).start();

    loop(a, 16000);
    loop(b, 22000);
    loop(c, 26000);

    Animated.loop(
      Animated.sequence([
        Animated.timing(shine, {
          toValue: 1,
          duration: 10000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(shine, {
          toValue: 0,
          duration: 10000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [a, b, c, shine]);

  const orb1 = {
    cx: a.interpolate({ inputRange: [0, 1], outputRange: [0.2 * width, 0.8 * width] }),
    cy: a.interpolate({ inputRange: [0, 1], outputRange: [0.25 * height, 0.15 * height] }),
    r: a.interpolate({ inputRange: [0, 1], outputRange: [height * 0.28, height * 0.34] }),
  };
  const orb2 = {
    cx: b.interpolate({ inputRange: [0, 1], outputRange: [0.85 * width, 0.15 * width] }),
    cy: b.interpolate({ inputRange: [0, 1], outputRange: [0.75 * height, 0.65 * height] }),
    r: b.interpolate({ inputRange: [0, 1], outputRange: [height * 0.22, height * 0.3] }),
  };
  const orb3 = {
    cx: c.interpolate({ inputRange: [0, 1], outputRange: [0.1 * width, 0.9 * width] }),
    cy: c.interpolate({ inputRange: [0, 1], outputRange: [0.55 * height, 0.35 * height] }),
    r: c.interpolate({ inputRange: [0, 1], outputRange: [height * 0.16, height * 0.22] }),
  };

  const shineY = shine.interpolate({ inputRange: [0, 1], outputRange: [-height, height] });

  const GREEN = "#4CAF50";
  const GREEN_SOFT = "#69D37A";
  const BLACK = "#000000";
  const WHITE = "#FFFFFF";
  const OFF_WHITE = "#F7FAFC";

  const gridStep = Math.max(80, Math.min(120, Math.round(width / 8)));
  const verticals = Array.from({ length: Math.ceil(width / gridStep) + 1 }, (_, i) => i * gridStep);
  const horizontals = Array.from({ length: Math.ceil(height / gridStep) + 1 }, (_, i) => i * gridStep);

  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="bgVignette" cx="50%" cy="50%" r="70%">
            <Stop offset="0%" stopColor={WHITE} stopOpacity={1} />
            <Stop offset="100%" stopColor={OFF_WHITE} stopOpacity={1} />
          </RadialGradient>

          <RadialGradient id="orbGreen" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={GREEN} stopOpacity={0.45} />
            <Stop offset="100%" stopColor={GREEN} stopOpacity={0} />
          </RadialGradient>

          <RadialGradient id="orbGreenSoft" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={GREEN_SOFT} stopOpacity={0.35} />
            <Stop offset="100%" stopColor={GREEN_SOFT} stopOpacity={0} />
          </RadialGradient>

          <LinearGradient id="shineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={BLACK} stopOpacity={0} />
            <Stop offset="50%" stopColor={BLACK} stopOpacity={0.035} />
            <Stop offset="100%" stopColor={BLACK} stopOpacity={0} />
          </LinearGradient>
        </Defs>

        <Rect x={0} y={0} width={width} height={height} fill="url(#bgVignette)" />

        <G opacity={0.06}>
          {verticals.map((x) => (
            <Line key={`v-${x}`} x1={x} y1={0} x2={x} y2={height} stroke={BLACK} strokeWidth={1} />
          ))}
          {horizontals.map((y) => (
            <Line key={`h-${y}`} x1={0} y1={y} x2={width} y2={y} stroke={BLACK} strokeWidth={1} />
          ))}
        </G>

        <AnimatedCircle cx={orb1.cx} cy={orb1.cy} r={orb1.r} fill="url(#orbGreen)" />
        <AnimatedCircle cx={orb2.cx} cy={orb2.cy} r={orb2.r} fill="url(#orbGreenSoft)" />
        <AnimatedCircle cx={orb3.cx} cy={orb3.cy} r={orb3.r} fill="url(#orbGreen)" />

        <G opacity={0.9}>
          <AnimatedRect
            x={-width}
            y={shineY}
            width={width * 3}
            height={Math.max(120, height * 0.18)}
            fill="url(#shineGrad)"
            transform={`rotate(25 ${width / 2} ${height / 2})`}
          />
        </G>

        <G opacity={0.08}>
          <Circle cx={width * 0.15} cy={height * 0.2} r={1.5} fill={WHITE} />
          <Circle cx={width * 0.35} cy={height * 0.8} r={1} fill={WHITE} />
          <Circle cx={width * 0.55} cy={height * 0.6} r={1.2} fill={WHITE} />
          <Circle cx={width * 0.75} cy={height * 0.3} r={1.4} fill={WHITE} />
          <Circle cx={width * 0.9} cy={height * 0.7} r={1.1} fill={WHITE} />
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
