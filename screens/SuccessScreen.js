import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Surface } from "react-native-paper";
import StunningBackground from "../components/StunningBackground";

export default function SuccessScreen({ route, navigation }) {
  const { userName } = route.params;

  return (
    <View style={styles.container}>
      <StunningBackground />
      <Surface style={styles.card} elevation={2}>
        <Text variant="headlineSmall" style={styles.success}>🎉 Registration Successful!</Text>
        <Text variant="titleMedium" style={styles.name}>Welcome, {userName}!</Text>
        <Button mode="contained" style={styles.cta} onPress={() => navigation.replace("Register")}>Register another</Button>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
    padding: 24,
  },
  card: {
    width: "100%",
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#111111",
    alignItems: "center",
  },
  success: {
    color: "#4CAF50",
    marginBottom: 8,
    textAlign: "center",
  },
  name: {
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
  },
  cta: { alignSelf: "center" },
});
