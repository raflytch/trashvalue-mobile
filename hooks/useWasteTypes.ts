import { useQuery } from "@tanstack/react-query";
import { getWasteTypes } from "@/services/wasteTypeService";

export const useWasteTypes = (page: number = 1, limit: number = 6) => {
  return useQuery({
    queryKey: ["wasteTypes", page, limit],
    queryFn: () => getWasteTypes(page, limit),
  });
};
