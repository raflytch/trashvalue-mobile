import { useQuery } from "@tanstack/react-query";
import { getUserTransactions } from "@/services/transactionService";
import { useSelector } from "react-redux";
import { RootState } from "@/features/store";

export const useUserTransactions = (
  page: number = 1,
  limit: number = 10,
  sortDirection: "asc" | "desc" = "desc"
) => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  return useQuery({
    queryKey: ["userTransactions", userId, page, limit, sortDirection],
    queryFn: () => getUserTransactions(userId!, page, limit, sortDirection),
    staleTime: 1000 * 60 * 5,
    enabled: !!userId,
  });
};
