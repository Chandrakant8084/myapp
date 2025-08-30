import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { addVitals } from "../services/api";
import { scanAndFetchVitals } from "../services/bluetoothVitals";

export default function VitalsScreen({ route, navigation }) {
  const { userId } = route.params || {};

  const [value, setValue] = useState("");
  const [vitalValue, setVitalValue] = useState("");

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Blood Pressure (BP)", value: "BP" },
    { label: "Blood Sugar", value: "Sugar" },
    { label: "Body Temperature", value: "Temp" },
    { label: "Heart Rate", value: "Heart Rate" },
    { label: "Oxygen Level (SpO2)", value: "SpO2" },
  ]);

  const handleAddVitals = async () => {
    if (!value || !vitalValue) {
      Alert.alert(
        "Validation Error",
        "Please select a vitals type and enter a value."
      );
      return;
    }

    try {
      await addVitals(userId, { type: value, value: vitalValue });
      Alert.alert("Success", "Vitals saved successfully");
      setValue(null);
      setVitalValue("");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save vitals");
    }
  };
  const handleBluetoothFetch = () => {
    scanAndFetchVitals((value) => {
      setVitalValue(value); // fill input
      Alert.alert("Fetched", `Received vitals: ${value}`);
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.scrollContainer}>
            <View style={styles.card}>
              <Text style={styles.heading}>🩺 Add Vitals</Text>

              <View style={{ zIndex: 1000 }}>
                <DropDownPicker
                  open={open}
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setItems}
                  placeholder="Select Vitals Type"
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                />
              </View>

              <TextInput
                placeholder="Enter value (e.g. 120/80)"
                value={vitalValue}
                onChangeText={setVitalValue}
                style={styles.input}
                placeholderTextColor="#555"
              />

              <TouchableOpacity style={styles.button} onPress={handleAddVitals}>
                <Text style={styles.buttonText}>Save Vitals</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btButton}
                onPress={handleBluetoothFetch}
              >
                <Text style={styles.btButtonText}>
                  📡 Fetch from Bluetooth Device
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 0,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007bff",
    textAlign: "center",
    marginBottom: 30,
  },
  dropdown: {
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 20,
  },
  dropdownContainer: {
    borderColor: "#ccc",
    borderRadius: 10,
    zIndex: 1000,
  },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#000",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  btButton: {
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  btButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
