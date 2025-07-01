export interface ChatPayload {
  message: string;
  image?: any;
}

export interface ChatResponse {
  status: string;
  message: string;
  data: {
    id: string;
    userId: string;
    message: string;
    response: string;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
    };
  };
}
