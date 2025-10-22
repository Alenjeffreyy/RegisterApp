import React, { useState } from "react";
import { View, StyleSheet, Alert, ScrollView, Platform, useWindowDimensions } from "react-native";
import { Text, TextInput, Button, HelperText, Divider, Surface } from "react-native-paper";
import StunningBackground from "../components/StunningBackground";
import Tilt from "../components/Tilt";
import WebCursorShivaImage from "../components/WebCursorShivaImage";
import WebTrishulOmBadge from "../components/WebTrishulOmBadge";

// Inline DOM style for web-native <input> elements (React DOM), not RN styles
const webDomInputStyle = {
  width: "100%",
  padding: 12,
  borderRadius: 6,
  border: "1px solid #ddd",
  fontSize: 16,
  backgroundColor: "#fff",
  boxSizing: "border-box",
};
import DateTimePicker from "@react-native-community/datetimepicker";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [reason, setReason] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthTime, setBirthTime] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const { width } = useWindowDimensions();
  const isWebWide = Platform.OS === "web" && width > 700;
  const shivaImageUrl = process.env.EXPO_PUBLIC_SHIVA_IMAGE_URL;

  const usersRef = collection(db, "users");

  const hasAnyEmptyField = !name || !phone || !birthPlace || !reason || !birthDate || !birthTime;

  const handleRegister = async () => {
    if (hasAnyEmptyField) {
      Alert.alert("தகவல் பூர்த்தி செய்யவில்லை", "தொடர அனைத்து புலங்களையும் பூர்த்தி செய்யவும்.");
      return;
    }

    try {
      const q = query(usersRef, where("phone", "==", phone));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        Alert.alert("ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது", "இந்த தொலைபேசி எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது.");
        return;
      }

      const formattedDate = birthDate.toLocaleDateString();
      const formattedTime = birthTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      await addDoc(usersRef, {
        name,
        phone,
        birthPlace,
        reason,
        birthDate: formattedDate,
        birthTime: formattedTime,
        createdAt: new Date(),
      });

      Alert.alert("வெற்றி", `${name} வெற்றிகரமாக பதிவு செய்யப்பட்டது!`);
      navigation.replace("Success", { userName: name });
    } catch (error) {
      console.error("Error saving data:", error);
      Alert.alert("பிழை", "பதிவு செய்யும் போது ஏதோ தவறு ஏற்பட்டது.");
    }
  };

  const closeBothPickers = () => {
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS !== "ios") setShowDatePicker(false);
    if (selectedDate) setBirthDate(selectedDate);
  };

  const onTimeChange = (event, selectedTime) => {
    if (Platform.OS !== "ios") setShowTimePicker(false);
    if (selectedTime) setBirthTime(selectedTime);
  };

  return (
    <View style={styles.root}>
      <StunningBackground />
      {Platform.OS === "web"
        ? (shivaImageUrl
            ? <WebCursorShivaImage size={140} imageUri={shivaImageUrl} />
            : <WebTrishulOmBadge size={140} />)
        : <Text style={styles.brandTopRight}>சிவன்</Text>}
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Tilt style={styles.tiltWrap}>
          <Surface style={styles.card} elevation={3}>
            <Text variant="headlineSmall" style={styles.TopTitle}>
              பஞ்சபக்ஷி
            </Text>
            <Text variant="titleLarge" style={styles.title}>
              நல்ல நேரம்
            </Text>

        <TextInput
          mode="outlined"
          label="பெயர்"
          value={name}
          onFocus={closeBothPickers}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          mode="outlined"
          label="தொலைபேசி எண்"
          keyboardType="phone-pad"
          value={phone}
          onFocus={closeBothPickers}
          onChangeText={setPhone}
          style={styles.input}
        />

        <Divider style={styles.divider} />
        <Text variant="titleMedium" style={styles.sectionTitle}>
          பிறப்பு விவரங்கள்
        </Text>

        <View
          style={[
            styles.dateTimeRow,
            isWebWide ? styles.webDateTimeRow : styles.mobileDateTimeRow,
          ]}
        >
          <View style={[styles.fieldContainer, isWebWide && styles.halfWidth]}>
            <Text style={styles.label}>பிறந்த தேதி</Text>
            {Platform.OS === "web" ? (
            <input
                type="date"
                value={birthDate ? birthDate.toISOString().substr(0, 10) : ""}
                onChange={(e) => setBirthDate(new Date(e.target.value))}
                placeholder="பிறந்த தேதியைத் தேர்ந்தெடுக்கவும்"
              style={webDomInputStyle}
              />
            ) : (
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                style={styles.pickerButton}
              >
                {birthDate ? birthDate.toLocaleDateString() : "தேதியைத் தேர்ந்தெடுக்கவும்"}
              </Button>
            )}
            {showDatePicker && Platform.OS !== "web" && (
              <DateTimePicker
                value={birthDate || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onDateChange}
              />
            )}
          </View>

          <View style={[styles.fieldContainer, isWebWide && styles.halfWidth]}>
            <Text style={styles.label}>பிறந்த நேரம்</Text>
            {Platform.OS === "web" ? (
            <input
                type="time"
                value={birthTime ? birthTime.toTimeString().substr(0, 5) : ""}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(":");
                  const newTime = new Date();
                  newTime.setHours(hours);
                  newTime.setMinutes(minutes);
                  setBirthTime(newTime);
                }}
                placeholder="பிறந்த நேரத்தைத் தேர்ந்தெடுக்கவும்"
              style={webDomInputStyle}
              />
            ) : (
              <Button
                mode="outlined"
                onPress={() => setShowTimePicker(true)}
                style={styles.pickerButton}
              >
                {birthTime
                  ? birthTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : "நேரத்தைத் தேர்ந்தெடுக்கவும்"}
              </Button>
            )}
            {showTimePicker && Platform.OS !== "web" && (
              <DateTimePicker
                value={birthTime || new Date()}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onTimeChange}
              />
            )}
          </View>
        </View>

        <TextInput
          mode="outlined"
          label="பிறந்த இடம்"
          value={birthPlace}
          onFocus={closeBothPickers}
          onChangeText={setBirthPlace}
          style={styles.input}
        />

        <TextInput
          mode="outlined"
          label="காரணம்"
          value={reason}
          onFocus={closeBothPickers}
          onChangeText={setReason}
          style={styles.input}
          multiline
        />

        <HelperText type="error" visible={hasAnyEmptyField}>
          தொடர அனைத்து புலங்களையும் பூர்த்தி செய்யவும்.
        </HelperText>

        <Tilt style={styles.tiltButton} tiltMaxDeg={10}>
            <Button mode="contained" onPress={handleRegister} style={styles.ctaButton} accessibilityLabel="பதிவை சமர்ப்பிக்கவும்">
              பதிவு செய்யவும்
            </Button>
          </Tilt>
          </Surface>
        </Tilt>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
  container: {
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 720,
    padding: 24,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  tiltWrap: {
    width: "100%",
    maxWidth: 720,
  },
  title: {
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  TopTitle: {
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 8,
    textAlign: "center",
  },
  input: {
    width: "100%",
    marginBottom: 12,
  },
  dateTimeRow: {
    width: "100%",
    marginBottom: 16,
  },
  webDateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  mobileDateTimeRow: {
    flexDirection: "column",
  },
  fieldContainer: {
    marginBottom: 12,
  },
  halfWidth: {
    width: "46%",
  },
  label: {
    fontWeight: "600",
    color: "#111827",
    opacity: 0.8,
    fontSize: 14,
    marginBottom: 6,
  },
  pickerButton: {
    width: "100%",
  },
  webInput: {
    // Unused: web uses DOM style object above to prevent RN style warnings
  },
  divider: { marginVertical: 8 },
  sectionTitle: { marginBottom: 8 },
  ctaButton: { marginTop: 8, borderRadius: 10 },
  tiltButton: { width: "100%" },
});
