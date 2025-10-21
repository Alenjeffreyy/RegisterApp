import React, { useEffect } from "react";
import { View, StyleSheet, Image, Platform } from "react-native";
import { Text } from "react-native-paper";
import StunningBackground from "../components/StunningBackground";
import WebCursorRobot from "../components/WebCursorRobot";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Register");
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StunningBackground />
      <WebCursorRobot size={160} />
      <Image
        source={require("../assets/logo.png")}
        style={styles.logoImage}
        resizeMode="contain"
      />
      <Text variant="headlineMedium" style={styles.logoText} accessibilityRole="header">
        PanchaPakshi
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Personalized insights, beautifully crafted
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  logoText: {
    color: "#111827",
    fontWeight: "bold",
    marginBottom: 6,
  },
  subtitle: {
    color: "#111827",
    opacity: 0.7,
  },
});
