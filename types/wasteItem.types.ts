export interface CreateWasteItemPayload {
  wasteTypeId: string;
  weight: number;
  notes: string;
  image: FormData | File;
}

export interface WasteItem {
  id: string;
  dropoffId: string;
  wasteTypeId: string;
  wasteType: {
    id: string;
    name: string;
    pricePerKg: number;
    image: string | null;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  weight: number;
  amount: number;
  notes: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface WasteItemResponse {
  status: string;
  message: string;
  data: WasteItem;
}

export interface WasteItemsResponse {
  status: string;
  message: string;
  data: WasteItem[];
  metadata: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}
