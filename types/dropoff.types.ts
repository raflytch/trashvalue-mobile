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

export interface WasteItem {
  id: string;
  dropoffId: string;
  wasteTypeId: string;
  weight: number;
  amount: number;
  image?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  wasteType?: WasteType;
}

export interface Dropoff {
  id: string;
  userId: string;
  status: string;
  totalWeight: number;
  totalAmount: number;
  pickupAddress: string;
  pickupDate: string;
  pickupMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  wasteItems: WasteItem[];
}

export interface DropoffResponse {
  status: string;
  message: string;
  data: Dropoff[];
  metadata: {
    currentPage: number;
    totalPages: number;
    totalDropoffs: number;
  };
}

export interface CreateDropoffPayload {
  pickupAddress: string;
  pickupDate: string;
  pickupMethod: "PICKUP" | "SELF_DROPOFF";
  notes?: string;
}

export interface CreateDropoffResponse {
  status: string;
  message: string;
  data: Dropoff;
}
