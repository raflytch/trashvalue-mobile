export interface WasteType {
  id: string;
  name: string;
  pricePerKg: number;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WasteTypeResponse {
  status: string;
  message: string;
  data: WasteType[];
  metadata: {
    currentPage: number;
    totalPages: number;
    totalWasteTypes: number;
  };
}
