import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleSendResetLink = async () => {
    if (!email) {
      Alert.alert("Validation", "Please enter your email address.");
      return;
    }

    try {
      const response = await axios.post("http://192.168.0.130:8080/api/auth/forgot-password", {
        email,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Reset link sent to your email.");
        navigation.navigate("Login"); // ✅ Make sure "Login" screen is registered in your navigator
      } else {
        Alert.alert("Error", "Something went wrong. Try again.");
      }
    } catch (error) {
      console.error("Error sending reset link:", error);
      Alert.alert("Error", "Failed to send reset link. Check your email or try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Forgot Password</Text>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleSendResetLink}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.backToLogin}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f0f8ff",
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#007bff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  backToLogin: {
    marginTop: 15,
    textAlign: "center",
    color: "#007bff",
    textDecorationLine: "underline",
  },
});
