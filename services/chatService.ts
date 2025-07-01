import api from "@/api/axios";
import { ChatPayload, ChatResponse } from "@/types/chat.types";

export const sendChat = async (payload: ChatPayload): Promise<ChatResponse> => {
  const formData = new FormData();
  formData.append("message", payload.message);

  if (payload.image) {
    formData.append("image", payload.image);
  }

  const response = await api.post<ChatResponse>("/chat", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const chatService = {
  sendChat,
};
