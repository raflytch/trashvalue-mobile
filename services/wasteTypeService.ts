import api from "@/api/axios";
import { WasteTypeResponse } from "@/types/waste.types";

export const getWasteTypes = async (
  page: number = 1,
  limit: number = 6
): Promise<WasteTypeResponse> => {
  const response = await api.get<WasteTypeResponse>(
    `/waste-types?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const wasteTypeService = {
  getWasteTypes,
};
