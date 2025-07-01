import { sendChat } from "@/services/chatService";
import { ChatPayload } from "@/types/chat.types";
import { useMutation } from "@tanstack/react-query";

export const useChat = () => {
  return useMutation({
    mutationFn: (payload: ChatPayload) => sendChat(payload),
  });
};
