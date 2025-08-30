import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";

export default function AboutAppScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>About App Page</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold" },
});
