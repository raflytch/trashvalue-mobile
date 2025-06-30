import api from "@/api/axios";
import {
  CreateWasteItemPayload,
  WasteItemResponse,
} from "@/types/wasteItem.types";

export const addWasteItem = async (
  dropoffId: string,
  payload: CreateWasteItemPayload
): Promise<WasteItemResponse> => {
  const formData = new FormData();
  formData.append("wasteTypeId", payload.wasteTypeId);
  formData.append("weight", payload.weight.toString());

  if (payload.notes) {
    formData.append("notes", payload.notes);
  }

  if (payload.image) {
    formData.append("image", payload.image as any);
  }

  const response = await api.post<WasteItemResponse>(
    `/waste/dropoffs/${dropoffId}/items`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const wasteItemService = {
  addWasteItem,
};
