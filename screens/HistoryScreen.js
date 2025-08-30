import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import axios from "axios";
import { AuthService } from "../services/AuthService";

export default function HistoryScreen() {
  const [history, setHistory] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const user = await AuthService.getUser();
      const userId = user?.id;

      if (!userId) {
        Alert.alert("Error", "User not found. Please login again.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `http://192.168.1.6:8080/api/vitals/${userId}`
      );
      const vitalsArray = res.data;

      const grouped = vitalsArray.reduce((acc, item) => {
        const date = item.timestamp.split("T")[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(item);
        return acc;
      }, {});

      setHistory(grouped);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch history");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getColorForType = (type) => {
    switch (type) {
      case "BP":
        return "#007bff";
      case "Sugar":
        return "#28a745";
      case "Temp":
        return "#ffc107";
      case "SpO2":
        return "#17a2b8";
      case "Heart Rate":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const formatDate = (rawDate) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(rawDate).toLocaleDateString(undefined, options);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading history...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {Object.keys(history).length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text style={styles.noData}>No history available.</Text>
        </View>
      ) : (
        Object.keys(history)
          .sort((a, b) => new Date(b) - new Date(a)) // latest first
          .map((date) => (
            <View key={date} style={styles.card}>
              <Text style={styles.date}>{formatDate(date)}</Text>
              {history[date].map((vital, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.vitalItem,
                    { borderLeftColor: getColorForType(vital.type) },
                  ]}
                >
                  <Text style={styles.vitalText}>
                    {vital.type}:{" "}
                    <Text style={{ color: getColorForType(vital.type) }}>
                      {vital.value}
                    </Text>
                  </Text>
                  <Text style={styles.timestamp}>
                    {new Date(vital.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
              ))}
            </View>
          ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f1f3f5",
  },
  card: {
    marginBottom: 20,
    padding: 14,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    elevation: 2,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: 10,
  },
  vitalItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderLeftWidth: 4,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginBottom: 8,
  },
  vitalText: {
    fontSize: 15,
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  noData: {
    textAlign: "center",
    color: "#6c757d",
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
});
