import React from "react";
import { Platform, StyleSheet } from "react-native";
import Svg, { Defs, LinearGradient, Stop, G, Circle, Path, Text } from "react-native-svg";

export default function WebTrishulOmBadge({ size = 140, style }) {
  if (Platform.OS !== "web") return null;

  const width = size;
  const height = size;
  const radius = size * 0.46;

  return (
    <div style={{ position: "absolute", top: 16, right: 16, zIndex: 10, ...style }}>
      <Svg width={width} height={height} role="img" aria-label="ॐ with trishul">
        <Defs>
          <LinearGradient id="ringGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#0ea5e9" />
            <Stop offset="100%" stopColor="#22c55e" />
          </LinearGradient>
          <LinearGradient id="trishulGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#34d399" />
            <Stop offset="100%" stopColor="#10b981" />
          </LinearGradient>
        </Defs>

        {/* halo ring */}
        <G>
          <Circle cx={width * 0.5} cy={height * 0.5} r={radius} fill="none" stroke="url(#ringGrad)" strokeWidth={8} opacity={0.95} />
        </G>

        {/* trishul simplified */}
        <G opacity={0.95}>
          <Path d={`M ${width * 0.5} ${height * 0.22} L ${width * 0.5} ${height * 0.70}`} stroke="url(#trishulGrad)" strokeWidth={6} strokeLinecap="round" />
          <Path d={`M ${width * 0.5} ${height * 0.22} Q ${width * 0.47} ${height * 0.16}, ${width * 0.44} ${height * 0.22}`} stroke="url(#trishulGrad)" strokeWidth={4} fill="none" strokeLinecap="round" />
          <Path d={`M ${width * 0.5} ${height * 0.22} Q ${width * 0.53} ${height * 0.16}, ${width * 0.56} ${height * 0.22}`} stroke="url(#trishulGrad)" strokeWidth={4} fill="none" strokeLinecap="round" />
        </G>

        {/* Om glyph (text) */}
        <Text
          x={width * 0.5}
          y={height * 0.78}
          textAnchor="middle"
          fontSize={size * 0.28}
          fontWeight="700"
          fill="#0f172a"
        >
          ॐ
        </Text>
      </Svg>
    </div>
  );
}

const styles = StyleSheet.create({});
