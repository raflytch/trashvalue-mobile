import api from "@/api/axios";
import {
  CreateDropoffPayload,
  CreateDropoffResponse,
  DropoffResponse,
} from "@/types/dropoff.types";

export const getDropoffs = async (
  page: number = 1,
  limit: number = 10,
  status: string = "PENDING"
): Promise<DropoffResponse> => {
  const response = await api.get<DropoffResponse>(
    `/dropoffs?page=${page}&limit=${limit}&status=${status}`
  );
  return response.data;
};

export const getCompletedDropoffs = async (
  page: number = 1,
  limit: number = 10
): Promise<DropoffResponse> => {
  const response = await api.get<DropoffResponse>(
    `/dropoffs?page=${page}&limit=${limit}&status=COMPLETED`
  );
  return response.data;
};

export const createDropoff = async (
  payload: CreateDropoffPayload
): Promise<CreateDropoffResponse> => {
  const response = await api.post<CreateDropoffResponse>("/dropoffs", payload);
  return response.data;
};

export const dropoffService = {
  getDropoffs,
  getCompletedDropoffs,
  createDropoff,
};
