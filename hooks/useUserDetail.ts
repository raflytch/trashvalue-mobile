import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateUserPayload } from "@/types/user.types";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { userService } from "@/services/userDetailService";

interface JwtPayload {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export const useUser = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const getUserId = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
          const decoded = jwtDecode<JwtPayload>(token);
          setUserId(decoded.id);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };

    getUserId();
  }, []);

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => (userId ? userService.getUserDetails(userId) : null),
    enabled: !!userId,
    staleTime: 0,
  });

  const updateUserMutation = useMutation({
    mutationFn: (payload: UpdateUserPayload | FormData) => {
      if (!userId) throw new Error("User ID not found");
      return userService.updateUserDetails(userId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (password: string) => {
      if (!userId) throw new Error("User ID not found");
      return userService.updatePassword(userId, password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });

  return {
    user,
    isLoading,
    error,
    refetch,
    updateUser: updateUserMutation.mutate,
    isUpdating: updateUserMutation.isPending,
    updatePassword: updatePasswordMutation.mutate,
    isUpdatingPassword: updatePasswordMutation.isPending,
    updateUserError: updateUserMutation.error,
    updatePasswordError: updatePasswordMutation.error,
  };
};
