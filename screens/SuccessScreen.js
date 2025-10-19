import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SuccessScreen({ route }) {
  const { userName } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.success}>🎉 Registration Successful!</Text>
      <Text style={styles.name}>Welcome, {userName}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  success: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    color: "#333",
  },
});
