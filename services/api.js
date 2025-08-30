import axios from 'axios';
import { AuthService } from './AuthService';

const API_BASE = 'http://192.168.1.6:8080/api';

// Helper to get auth headers with token
const getAuthHeaders = async () => {
  const token = await AuthService.getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ✅ PUBLIC APIs (no auth required)
export const registerUser = async (user) => {
  return axios.post(`${API_BASE}/auth/register`, user); // 🔁 CHANGED endpoint
};

export const loginUser = async (credentials) => {
  return axios.post(`${API_BASE}/auth/login`, credentials);
};

// ✅ PROTECTED APIs (auth required)
export const addVitals = async (userId, vitals) => {
  const headers = await getAuthHeaders();
  return axios.post(`${API_BASE}/vitals/${userId}`, vitals, headers);
};

export const getVitals = async (userId) => {
  const headers = await getAuthHeaders();
  return axios.get(`${API_BASE}/vitals/${userId}`, headers);
};

export const getVitalsHistory = async (userId) => {
  const headers = await getAuthHeaders();
  return axios.get(`${API_BASE}/vitals/history/${userId}`, headers);
};

// ✅ Admin APIs
export const getUsers = async () => {
  const headers = await getAuthHeaders();
  return axios.get(`${API_BASE}/admin/users`, headers);
};

export const searchUsers = async (query) => {
  const headers = await getAuthHeaders();
  return axios.get(`${API_BASE}/admin/search?q=${encodeURIComponent(query)}`, headers);
};
