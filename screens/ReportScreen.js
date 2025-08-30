import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { getVitals } from '../services/api';
import { AuthService } from '../services/AuthService';

export default function ReportScreen({ route, navigation }) {
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Check if userId was passed via navigation
        let authUser;
        if (route?.params?.userId) {
          authUser = {
            id: route.params.userId,
            name: route.params.userName || 'Patient',
          };
        } else {
          // ✅ Otherwise get from AuthService
          authUser = await AuthService.getUser();
        }

        console.log('📌 ReportScreen loaded with user:', authUser);

        if (!authUser || !authUser.id) {
          Alert.alert('Error', 'User not logged in');
          setLoading(false);
          return;
        }

        setUser(authUser);

        // ✅ Fetch vitals
        const res = await getVitals(authUser.id);
        console.log('📌 API Response:', res.data);

        setVitals(res.data || []);
      } catch (err) {
        console.error('❌ Error fetching vitals:', err);
        Alert.alert('Error', 'Failed to load vitals');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [route]);

  const getColorForType = (type) => {
    switch (type) {
      case 'BP': return '#007bff';
      case 'Sugar': return '#28a745';
      case 'Temp': return '#ffc107';
      case 'SpO2': return '#17a2b8';
      case 'Heart Rate': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const renderVitalItem = ({ item }) => (
    <View style={[styles.card, { borderLeftColor: getColorForType(item.type) }]}>
      <Text style={styles.vitalType}>
        {item.type}: <Text style={{ color: getColorForType(item.type) }}>{item.value}</Text>
      </Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📊 Health Report</Text>

      {vitals.length === 0 ? (
        <Text style={styles.noData}>No vitals found.</Text>
      ) : (
        <FlatList
          data={vitals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderVitalItem}
          contentContainerStyle={{ paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('PDFReport', {
              reportData: vitals,
              patientName: user?.name || 'Patient',
            })
          }
        >
          <Text style={styles.buttonText}>📄 Download PDF Report</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#28a745' }]}
          onPress={() => navigation.navigate('Charts', { userId: user?.id })}
        >
          <Text style={styles.buttonText}>📈 View Trends (Graphs)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 5,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  vitalType: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  timestamp: {
    fontSize: 13,
    color: '#6c757d',
    marginTop: 6,
  },
  noData: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginVertical: 30,
  },
  buttonGroup: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
