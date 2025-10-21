import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Surface } from "react-native-paper";
import StunningBackground from "../components/StunningBackground";
import Tilt from "../components/Tilt";
import WebCursorRobot from "../components/WebCursorRobot";

export default function SuccessScreen({ route, navigation }) {
  const { userName } = route.params;

  return (
    <View style={styles.container}>
      <StunningBackground />
      <Text style={styles.brandTopRight}>Shiv</Text>
      <Tilt>
        <Surface style={styles.card} elevation={2}>
        <Text variant="headlineSmall" style={styles.success}>🎉 Registration Successful!</Text>
        <Text variant="titleMedium" style={styles.name}>Welcome, {userName}!</Text>
        <Tilt tiltMaxDeg={10}>
          <Button mode="contained" style={styles.cta} onPress={() => navigation.replace("Register")}>Register another</Button>
        </Tilt>
      </Surface>
      </Tilt>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 24,
  },
  brandTopRight: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  card: {
    width: "100%",
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  success: {
    color: "#4CAF50",
    marginBottom: 8,
    textAlign: "center",
  },
  name: {
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  cta: { alignSelf: "center" },
});
