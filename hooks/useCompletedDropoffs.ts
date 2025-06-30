import { useQuery } from "@tanstack/react-query";
import { getCompletedDropoffs } from "@/services/dropoffService";

export const useCompletedDropoffs = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["completedDropoffs", page, limit],
    queryFn: () => getCompletedDropoffs(page, limit),
    staleTime: 1000 * 60 * 5,
  });
};
