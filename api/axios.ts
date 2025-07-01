import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { store } from "../features/store";
import { logout } from "../features/slices/authSlice";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      if (isTokenExpired(token)) {
        await SecureStore.deleteItemAsync("token");
        store.dispatch(logout());
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("token");
      store.dispatch(logout());
    }
    if (error.response && error.response.data && error.response.data.message) {
      return Promise.reject({
        ...error,
        message: error.response.data.message,
      });
    }
    return Promise.reject(error);
  }
);

export default api;
