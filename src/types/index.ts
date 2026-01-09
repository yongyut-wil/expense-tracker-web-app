// API Response Structure
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
  } | null;
  meta: {
    timestamp: string;
    path: string;
  };
}

// Domain Interfaces
export interface User {
  id: number;
  email: string;
  name: string | null;
}

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  date: string;
  userId: number;
}

export interface DashboardData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

export interface AuthResponse {
  access_token: string;
  user?: User; // Optional, in case the API returns user info on login
}
