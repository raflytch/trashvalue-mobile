import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addWasteItem } from "@/services/wasteItemService";
import { CreateWasteItemPayload } from "@/types/wasteItem.types";

export const useAddWasteItem = (dropoffId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWasteItemPayload) =>
      addWasteItem(dropoffId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wasteItems", dropoffId] });
      queryClient.invalidateQueries({ queryKey: ["dropoffs"] });
    },
  });
};
