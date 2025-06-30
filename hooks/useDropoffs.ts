import { useQuery } from "@tanstack/react-query";
import { getDropoffs } from "@/services/dropoffService";

export const useDropoffs = (
  page: number = 1,
  limit: number = 10,
  status: string = "PENDING"
) => {
  return useQuery({
    queryKey: ["dropoffs", page, limit, status],
    queryFn: () => getDropoffs(page, limit, status),
    staleTime: 1000 * 60 * 5,
  });
};
