import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginUser } from "@/services/authService";
import {
  loginStart,
  loginSuccess,
  loginFailed,
} from "@/features/slices/authSlice";

export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: loginUser,
    onMutate: () => {
      dispatch(loginStart());
    },
    onSuccess: (data) => {
      dispatch(
        loginSuccess({
          user: {
            id: data.data.id,
            email: data.data.email,
            name: data.data.name,
            role: data.data.role,
          },
          token: data.token,
        })
      );
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Login failed";
      dispatch(loginFailed(errorMessage));
    },
  });
};
