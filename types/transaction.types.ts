export interface TopUpPayload {
  amount: number;
  paymentMethod: "BANK_TRANSFER" | "E_WALLET";
}

export interface TopUpResponse {
  status: string;
  message: string;
  data: {
    transaction: {
      id: string;
      userId: string;
      amount: number;
      type: string;
      status: string;
      paymentMethod: string;
      paymentId: string | null;
      description: string;
      createdAt: string;
      updatedAt: string;
      user: {
        id: string;
        name: string;
        phone: string;
        email: string;
      };
    };
    redirectUrl: string;
  };
  token: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: "DEPOSIT" | "WITHDRAWAL";
  status: "PENDING" | "COMPLETED" | "REJECTED";
  paymentMethod: "BANK_TRANSFER" | "E_WALLET" | "CASH" | null;
  paymentId: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionsResponse {
  status: string;
  message: string;
  data: Transaction[];
  metadata: {
    currentPage: number;
    totalPages: number;
    totalTransactions: number;
  };
}

export interface TransactionResponse {
  status: string;
  message: string;
  data: Transaction[];
  metadata: {
    currentPage: number;
    totalPages: number;
    totalTransactions: number;
  };
}

export interface WithdrawalPayload {
  amount: number;
  paymentMethod: "BANK_TRANSFER" | "E_WALLET" | "CASH";
  description: string;
}

export interface WithdrawalResponse {
  status: string;
  message: string;
  data: Transaction;
}
