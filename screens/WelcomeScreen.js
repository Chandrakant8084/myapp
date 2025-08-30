import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from "react-native";

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top red dot */}
      <View style={styles.dot} />

      {/* Header */}
      <Text style={styles.welcome}>Welcome to</Text>
      <Text style={styles.brand}>Self Care</Text>

      {/* Illustration */}
      <Image
        source={require("../assets/mascot.png")}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Buttons */}
      <TouchableOpacity
        style={styles.signupButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.signupText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 120,
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
    position: "absolute",
    top: 20,
    left: 20,
  },
  welcome: {
    fontSize: 20,
    color: "#444",
    marginTop: 10,
  },
  brand: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#5D3FD3",
    marginBottom: 30,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 40,
  },
  signupButton: {
    backgroundColor: "#5D3FD3",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
    marginBottom: 15,
  },
  signupText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginButton: {
    borderColor: "#5D3FD3",
    borderWidth: 1.5,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
  },
  loginText: {
    color: "#5D3FD3",
    fontSize: 16,
    fontWeight: "bold",
  },
});
