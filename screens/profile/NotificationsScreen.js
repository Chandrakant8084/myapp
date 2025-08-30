import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Notifications Page</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold" },
});
