import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDropoff } from "@/services/dropoffService";
import { CreateDropoffPayload } from "@/types/dropoff.types";

export const useCreateDropoff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDropoffPayload) => createDropoff(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dropoffs"] });
    },
  });
};
