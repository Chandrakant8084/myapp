import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthService } from "../services/AuthService";

export default function UserProfileScreen({ navigation, setIsAuthenticated }) {
  const handleLogout = async () => {
    await AuthService.clearSession();
    await AuthService.clearUser();
    setIsAuthenticated(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Info */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>johndoe@gmail.com</Text>
        </View>

        {/* Account Options */}
        <View style={styles.optionCard}>
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Ionicons name="person-outline" size={22} color="#007bff" />
            <Text style={styles.optionText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => navigation.navigate("Settings")}
          >
            <Ionicons name="settings-outline" size={22} color="#007bff" />
            <Text style={styles.optionText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Ionicons name="notifications-outline" size={22} color="#007bff" />
            <Text style={styles.optionText}>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => navigation.navigate("Privacy")}
          >
            <Ionicons name="lock-closed-outline" size={22} color="#007bff" />
            <Text style={styles.optionText}>Privacy</Text>
          </TouchableOpacity>
        </View>

        {/* Support */}
        <View style={styles.optionCard}>
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => navigation.navigate("HelpSupport")}
          >
            <Ionicons name="help-circle-outline" size={22} color="#007bff" />
            <Text style={styles.optionText}>Help & Support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => navigation.navigate("AboutApp")}
          >
            <Ionicons
              name="information-circle-outline"
              size={22}
              color="#007bff"
            />
            <Text style={styles.optionText}>About App</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  scrollContent: { padding: 20 },
  profileCard: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    elevation: 2,
  },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: "bold", color: "#333" },
  email: { fontSize: 14, color: "#666" },

  optionCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 10,
    marginBottom: 20,
    elevation: 2,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  optionText: { marginLeft: 15, fontSize: 16, color: "#333" },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff4d4d",
    padding: 15,
    borderRadius: 15,
    justifyContent: "center",
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});
