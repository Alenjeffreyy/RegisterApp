import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
  Platform,
  useWindowDimensions,
} from "react-native";
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

  const usersRef = collection(db, "users");

  const handleRegister = async () => {
    if (!name || !phone || !birthPlace || !reason || !birthDate || !birthTime) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const q = query(usersRef, where("phone", "==", phone));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        Alert.alert("Already Registered", "This phone number is already registered.");
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

      Alert.alert("Success", `Registered ${name} successfully!`);
      navigation.replace("Success", { userName: name });
    } catch (error) {
      console.error("Error saving data:", error);
      Alert.alert("Error", "Something went wrong while registering.");
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
    <ScrollView
      contentContainerStyle={[
        styles.container,
        Platform.OS === "web" && styles.webContainer,
      ]}
    >
      <Text style={styles.TopTitle}>PanchaPakshi</Text>
      <Text style={styles.title}>Register</Text>

      {/* Name */}
      <View style={styles.input}>
        <TextInput
          placeholder="Full Name / பெயர்"
          value={name}
          onFocus={closeBothPickers}
          onChangeText={setName}
        />
      </View>

      {/* Phone */}
      <View style={styles.input}>
        <TextInput
          placeholder="Phone Number / தொலைபேசி எண்"
          keyboardType="phone-pad"
          value={phone}
          onFocus={closeBothPickers}
          onChangeText={setPhone}
        />
      </View>

      {/* Birth Date & Time Section */}
      <View
        style={[
          styles.dateTimeRow,
          isWebWide ? styles.webDateTimeRow : styles.mobileDateTimeRow,
        ]}
      >
        <View style={[styles.fieldContainer, isWebWide && styles.halfWidth]}>
          <Text style={styles.label}>Birth Date / பிறப்பு தேதி</Text>
          {Platform.OS === "web" ? (
            <input
              type="date"
              value={birthDate ? birthDate.toISOString().substr(0, 10) : ""}
              onChange={(e) => setBirthDate(new Date(e.target.value))}
              placeholder="Select Birth Date / பிறப்பு தேதி"
              style={styles.webInput}
            />
          ) : (
            <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDatePicker(true)}>
              <Text style={birthDate ? styles.selectedText : styles.placeholderText}>
                {birthDate
                  ? birthDate.toLocaleDateString()
                  : "Select Birth Date / பிறப்பு தேதி"}
              </Text>
            </TouchableOpacity>
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

        {/* Birth Time */}
        <View style={[styles.fieldContainer, isWebWide && styles.halfWidth]}>
          <Text style={styles.label}>Birth Time / பிறப்பு நேரம்</Text>
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
              placeholder="Select Birth Time / பிறப்பு நேரம்"
              style={styles.webInput}
            />
          ) : (
            <TouchableOpacity style={styles.pickerButton} onPress={() => setShowTimePicker(true)}>
              <Text style={birthTime ? styles.selectedText : styles.placeholderText}>
                {birthTime
                  ? birthTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Select Birth Time / பிறப்பு நேரம்"}
              </Text>
            </TouchableOpacity>
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

      {/* Birth Place */}
      <View style={styles.input}>
        <TextInput
          placeholder="Birth Place / பிறப்பு இடம்"
          value={birthPlace}
          onFocus={closeBothPickers}
          onChangeText={setBirthPlace}
        />
      </View>

      {/* Reason */}
      <View style={styles.input}>
        <TextInput
          placeholder="Reason / காரணம்"
          value={reason}
          onFocus={closeBothPickers}
          onChangeText={setReason}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  webContainer: {
    width: "50%",
    alignSelf: "center",
    paddingVertical: 40,
  },
  title: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    fontSize: 24,
    fontFamily: "Cochin",
  },
  TopTitle: {
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 16,
    fontSize: 26,
    fontFamily: "Cochin",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
    justifyContent: "center",
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
    fontWeight: "bold",
    color: "#333",
    fontSize: 14,
    marginBottom: 6,
    fontFamily: "Cochin",
  },
  pickerButton: {
    width: "100%",
    padding: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
    fontFamily: "Cochin",
  },
  selectedText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Cochin",
  },
  webInput: {
    width: "100%",
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    fontFamily: "Cochin",
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
