import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { registerUser } from "@/services/userService";
import { setCredentials, setLoading } from "@/features/slices/registerSlice";

export const useRegister = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: registerUser,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(setCredentials(data.data));
      dispatch(setLoading(false));
    },
    onError: () => {
      dispatch(setLoading(false));
    },
  });
};
