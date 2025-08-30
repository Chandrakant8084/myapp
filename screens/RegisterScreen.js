import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { registerUser } from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Validation Error', 'Name, Email and Password are required');
      return;
    }

    try {
      await registerUser({ name, email, password });
      Alert.alert('✅ Registered Successfully', 'You can now login.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err) {
      console.error('Register failed:', err.response?.data || err.message);
      Alert.alert('Registration Failed', err.response?.data?.error || 'Server error');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={80}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Text style={styles.welcome}>Hello Beautiful</Text>
            <Text style={styles.heading}>Sign Up</Text>

            <Image
              source={require('../assets/mascot.png')} // 👈 update path to match your project structure
              style={styles.image}
              resizeMode="contain"
            />

            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#A9A9A9"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#A9A9A9"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#A9A9A9"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />

            <TouchableOpacity style={styles.forgot}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    alignItems: 'center',
  },
  welcome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6a1b9a',
    marginBottom: 4,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4A148C',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 180,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    fontSize: 16,
    color: '#000',
    marginBottom: 12,
  },
  forgot: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 14,
    color: '#6c63ff',
  },
  button: {
    backgroundColor: '#4A148C',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#444',
  },
  footerLink: {
    fontSize: 14,
    color: '#6c63ff',
    fontWeight: '600',
  },
});
