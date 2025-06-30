import api from "@/api/axios";
import { UpdateUserPayload, User, UserResponse } from "@/types/user.types";

const getUserDetails = async (userId: string): Promise<User> => {
  const response = await api.get<UserResponse>(`/users/${userId}`);
  return response.data.data;
};

const updateUserDetails = async (
  userId: string,
  payload: UpdateUserPayload | FormData
): Promise<User> => {
  let config = {};

  if (payload instanceof FormData) {
    config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
  }

  const response = await api.patch<UserResponse>(
    `/users/${userId}`,
    payload,
    config
  );

  return response.data.data;
};

const updatePassword = async (
  userId: string,
  password: string
): Promise<User> => {
  const response = await api.patch<UserResponse>(`/users/${userId}`, {
    password,
  });
  return response.data.data;
};

export const userService = {
  getUserDetails,
  updateUserDetails,
  updatePassword,
};
