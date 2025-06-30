import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTopUp } from "@/services/transactionService";
import { TopUpPayload } from "@/types/transaction.types";

export const useTopUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TopUpPayload) => createTopUp(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
