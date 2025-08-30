import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

// Screens
import HistoryScreen from "./screens/HistoryScreen";
import HomeScreen from "./screens/HomeScreen";
import ReportScreen from "./screens/ReportScreen";
import PdfReportScreen from "./screens/PdfReportScreen";
import ChatbotScreen from "./screens/ChatbotScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ChartScreen from "./screens/ChartScreen";
import AdminDashboard from "./screens/AdminDashboard";
import VitalsScreen from "./screens/VitalsScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import ForgetPasswordScreen from "./screens/ForgetPassword";
import WelcomeScreen from "./screens/WelcomeScreen";

// 👉 Profile Placeholder Screens
import EditProfileScreen from "./screens/profile/EditProfileScreen";
import SettingsScreen from "./screens/profile/SettingsScreen";
import NotificationsScreen from "./screens/profile/NotificationsScreen";
import PrivacyScreen from "./screens/profile/PrivacyScreen";
import HelpSupportScreen from "./screens/profile/HelpSupportScreen";
import AboutAppScreen from "./screens/profile/AboutAppScreen";

// Services
import { AuthService } from "./services/AuthService";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function UserTabs({ setIsAuthenticated }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0.5,
          paddingBottom: 5,
          height: 60,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Vitals":
              iconName = "fitness";
              break;
            case "Reports":
              iconName = "document-text";
              break;
            case "Chatbot":
              iconName = "chatbubble-ellipses";
              break;
            case "Profile":
              iconName = "person-circle";
              break;
            default:
              iconName = "ellipse";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home">
        {(props) => (
          <HomeScreen {...props} setIsAuthenticated={setIsAuthenticated} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Vitals" component={VitalsScreen} />
      <Tab.Screen name="Reports" component={ReportScreen} />
      <Tab.Screen name="Chatbot" component={ChatbotScreen} />
      <Tab.Screen name="Profile" component={UserProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AuthService.getToken();
      const user = await AuthService.getUser();

      if (!token || !user || !user.id) {
        await AuthService.clearSession();
        await AuthService.clearUser();
        setIsAuthenticated(false);
        setIsAuthChecked(true);
        return;
      }

      try {
        await axios.get("http://192.168.1.6:8080/api/auth/validate", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRole(user.role);
        setIsAuthenticated(true);
      } catch (err) {
        console.log("Token invalid or expired, clearing session.");
        await AuthService.clearSession();
        await AuthService.clearUser();
        setIsAuthenticated(false);
      } finally {
        setIsAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  if (!isAuthChecked) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f0f8ff" />
        <Text style={styles.appName}>🏥 Health Tracker</Text>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          userRole === "ADMIN" ? (
            <>
              <Stack.Screen name="AdminDashboard">
                {(props) => (
                  <AdminDashboard
                    {...props}
                    setIsAuthenticated={setIsAuthenticated}
                  />
                )}
              </Stack.Screen>
              {/* Removed duplicate Reports here ✅ */}
            </>
          ) : (
            <>
              {/* 👇 User Routes wrapped in Bottom Tabs */}
              <Stack.Screen name="UserTabs">
                {(props) => (
                  <UserTabs {...props} setIsAuthenticated={setIsAuthenticated} />
                )}
              </Stack.Screen>

              {/* Extra Routes (accessible from Profile options) */}
              <Stack.Screen name="PDFReport" component={PdfReportScreen} />
              <Stack.Screen name="Charts" component={ChartScreen} />
              <Stack.Screen name="History" component={HistoryScreen} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="Notifications" component={NotificationsScreen} />
              <Stack.Screen name="Privacy" component={PrivacyScreen} />
              <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
              <Stack.Screen name="AboutApp" component={AboutAppScreen} />
            </>
          )
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login">
              {(props) => (
                <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register">
              {(props) => (
                <RegisterScreen {...props} setIsAuthenticated={setIsAuthenticated} />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="ForgetPassword"
              component={ForgetPasswordScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007bff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
});
