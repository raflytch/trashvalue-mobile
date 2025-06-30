export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  points: number;
  balance: number;
  role: string;
  createdAt: string;
  updatedAt: string;
  profileImage: string;
  backgroundPhoto: string;
}

export interface UserResponse {
  status: string;
  message: string;
  data: User;
}

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  address?: string;
  backgroundPhoto?: string;
}

export interface UpdatePasswordPayload {
  password: string;
}
