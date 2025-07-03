import api from "@/api/axios";
import { WasteBankResponse } from "@/types/waste-bank.types";

export const getWasteBanks = async (
  page: number = 1,
  limit: number = 5
): Promise<WasteBankResponse> => {
  const response = await api.get<WasteBankResponse>(
    `/waste-banks?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const wasteBankService = {
  getWasteBanks,
};
