import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅ Import SafeArea

export default function HomeScreen({ setIsAuthenticated }) {
  const navigation = useNavigation();
  const [username, setUsername] = useState("User");

  useEffect(() => {
    setUsername("Chandrakant");
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {" "}
      {/* ✅ SafeArea wrapper */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>👋 Hello, {username}</Text>
          <Text style={styles.subTitle}>Welcome back to Health Tracker</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("Vitals", { userId: 1 })} // ✅ added param
            >
              <Ionicons name="add-circle" size={30} color="#e63946" />
              <Text style={styles.cardText}>Add Vitals</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("History")}
            >
              <MaterialCommunityIcons
                name="medical-bag"
                size={30}
                color="#457b9d"
              />{" "}
              {/* ✅ fixed */}
              <Text style={styles.cardText}>Medical History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("Chatbot")}
            >
              <Ionicons name="chatbubbles" size={30} color="#2a9d8f" />
              <Text style={styles.cardText}>Chatbot</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>
              🩺 Last Vital Check: BP 120/80
            </Text>
            <Text style={styles.activityText}>
              📄 Last Report: Blood Test (2 days ago)
            </Text>
          </View>
        </View>

        {/* Health Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Tips</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              💡 Walk at least 30 minutes a day for a healthy heart.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa", // ✅ so top area also matches
  },
  container: { flex: 1, padding: 15 },
  header: { marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: "bold", color: "#1d3557" },
  subTitle: { fontSize: 14, color: "#555" },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1d3557",
  },
  quickActions: { flexDirection: "row", justifyContent: "space-between" },
  card: {
    flex: 1,
    alignItems: "center",
    padding: 15,
    marginHorizontal: 5,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
  },
  cardText: { marginTop: 5, fontSize: 14, fontWeight: "500", color: "#333" },
  activityCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    elevation: 2,
  },
  activityText: { fontSize: 14, color: "#444", marginBottom: 5 },
  tipCard: {
    backgroundColor: "#eaf4f4",
    padding: 15,
    borderRadius: 12,
  },
  tipText: { fontSize: 14, color: "#264653" },
});
