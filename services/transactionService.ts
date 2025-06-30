import api from "@/api/axios";
import {
  TopUpPayload,
  TopUpResponse,
  TransactionsResponse,
  WithdrawalPayload,
  WithdrawalResponse,
} from "@/types/transaction.types";

export const createTopUp = async (
  payload: TopUpPayload
): Promise<TopUpResponse> => {
  const response = await api.post<TopUpResponse>(
    "/transactions/topup",
    payload
  );
  return response.data;
};

export const getUserTransactions = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
  sortDirection: "asc" | "desc" = "desc"
): Promise<TransactionsResponse> => {
  const response = await api.get<TransactionsResponse>(
    `/transactions/users/${userId}?page=${page}&limit=${limit}&sort=${sortDirection}`
  );
  return response.data;
};

export const createWithdrawal = async (
  payload: WithdrawalPayload
): Promise<WithdrawalResponse> => {
  const response = await api.post<WithdrawalResponse>(
    "/transactions/withdrawal",
    payload
  );
  return response.data;
};

export const transactionService = {
  createWithdrawal,
};
