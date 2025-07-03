import { useQuery } from "@tanstack/react-query";
import { getWasteBanks } from "@/services/wasteBankService";

export const useWasteBanks = (page: number = 1, limit: number = 5) => {
  return useQuery({
    queryKey: ["wasteBanks", page, limit],
    queryFn: () => getWasteBanks(page, limit),
    staleTime: 1000 * 60 * 5,
  });
};
