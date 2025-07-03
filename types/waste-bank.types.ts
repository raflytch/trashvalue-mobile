export interface WasteBank {
  id: string;
  name: string;
  address: string;
  _count: {
    dropoffs: number;
  };
}

export interface WasteBankResponse {
  status: string;
  message: string;
  data: WasteBank[];
  metadata: {
    currentPage: number;
    totalPages: number;
    totalWasteBanks: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
