import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text } from "react-native-paper";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Register");
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
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
    backgroundColor: "#F8FAFC",
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
    color: "#6B7280",
  },
});
