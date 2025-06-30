import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWithdrawal } from "@/services/transactionService";
import { WithdrawalPayload } from "@/types/transaction.types";

export const useWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WithdrawalPayload) => createWithdrawal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userDetail"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
