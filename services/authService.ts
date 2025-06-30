import { LoginCredentials } from "@/types/auth.types";
import api from "../api/axios";
import * as SecureStore from "expo-secure-store";

export const loginUser = async (credentials: LoginCredentials) => {
  const response = await api.post("/users/login", credentials);

  if (response.data.token) {
    await SecureStore.setItemAsync("token", response.data.token);
  }

  return response.data;
};
