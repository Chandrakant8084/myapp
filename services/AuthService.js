import AsyncStorage from '@react-native-async-storage/async-storage';

export class AuthService {
  static async setSession(token, userId, role) {
    await AsyncStorage.multiSet([
      ['token', token],
      ['userId', userId.toString()],
      ['role', role],
    ]);
  }

  static async getToken() {
    return await AsyncStorage.getItem('token');
  }

  static async clearSession() {
    await AsyncStorage.multiRemove(['token', 'userId', 'role']);
  }

  static async saveUser(user) {
    if (!user) return;
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      console.error('Error saving user info:', err);
    }
  }

  static async getUser() {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (!userJson) return null;
      return JSON.parse(userJson);
    } catch (err) {
      console.error('Error getting user info:', err);
      return null;
    }
  }

  static async clearUser() {
    try {
      await AsyncStorage.removeItem('user');
    } catch (err) {
      console.error('Error clearing user info:', err);
    }
  }
}
