import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import axios from 'axios';
import { AuthService } from '../services/AuthService';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation, setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef(null);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const login = async () => {
    setEmailError(false);

    if (!email || !password) {
      Alert.alert('Validation Error', 'Email and password are required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError(true);
      return;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://192.168.1.6:8080/api/auth/login', {
        email,
        password,
      });

      const { token, userId, role, name } = res.data;

      await AuthService.setSession(token, userId, role);
      await AuthService.saveUser({ id: userId, name: name || '', email, role });

      setIsAuthenticated(true);
      Alert.alert('Login successful');
    } catch (err) {
      console.error(err);
      Alert.alert('Login failed', 'Invalid credentials or server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.welcome}>Welcome Back</Text>
          <Text style={styles.loginTitle}>Login</Text>

          <Image
            source={require('../assets/mascot.png')}
            style={styles.image}
            resizeMode="contain"
          />

          <View style={[styles.inputWrapper, emailError && styles.errorBorder]}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError(false);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              style={styles.input}
            />
          </View>
          {emailError && (
            <Text style={styles.errorText}>Please enter your email address</Text>
          )}

          <View style={styles.inputWrapper}>
            <TextInput
              ref={passwordRef}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureText}
              style={styles.input}
              returnKeyType="done"
              onSubmitEditing={login}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setSecureText(!secureText)}
            >
              <Ionicons
                name={secureText ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgetPassword')}
            style={styles.forgot}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={login}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 100,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcome: {
    fontSize: 18,
    color: '#5D3FD3',
    marginBottom: 4,
    fontWeight: '600',
  },
  loginTitle: {
    fontSize: 28,
    color: '#4B0082',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  errorBorder: {
    borderColor: 'red',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    paddingLeft: 8,
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginTop: -10,
    fontSize: 13,
  },
  forgot: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotText: {
    color: '#5D3FD3',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#4B0082',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#555',
  },
  signupLink: {
    fontSize: 14,
    color: '#5D3FD3',
    fontWeight: 'bold',
  },
});
