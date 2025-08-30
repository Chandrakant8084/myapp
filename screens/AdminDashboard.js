import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { AuthService } from '../services/AuthService';


export default function AdminDashboard({ navigation, setIsAuthenticated }) {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const baseURL = `http://192.168.0.130:8080/api/admin`;
      const url = query.trim()
        ? `${baseURL}/search?q=${encodeURIComponent(query)}`
        : `${baseURL}/users`;
      const res = await axios.get(url);
      setUsers(res.data);
    } catch (err) {
      console.error('Error loading users:', err.message);
      Alert.alert('Error', 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AuthService.clearSession();
    await AuthService.clearUser();
    setIsAuthenticated(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.email}>{item.email}</Text>
      <Button
        title="View Report"
        onPress={() => navigation.navigate('Reports', { userId: item.id })}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Patients</Text>
      <TextInput
        placeholder="Search by name or email"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
        onSubmitEditing={fetchUsers}
        returnKeyType="search"
      />
      <Button title="Search" onPress={fetchUsers} />

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>No users found.</Text>}
          style={{ marginTop: 10 }}
        />
      )}

      {/* ✅ Logout Button */}
      <View style={{ marginTop: 30 }}>
        <Button title="Logout" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  name: { fontSize: 16, fontWeight: 'bold' },
  email: { fontSize: 14, color: '#555', marginBottom: 5 },
  empty: { textAlign: 'center', marginTop: 20, color: '#999' },
});
