export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

// API Response Structure
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: any;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // ISO Date string
  userId: number;
}

export interface CreateTransactionDto {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date?: string;
}

export interface UpdateTransactionDto {
  title?: string;
  amount?: number;
  type?: TransactionType;
  category?: string;
  date?: string;
}

export interface DashboardData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  previousMonthIncome: number;
  previousMonthExpense: number;
  incomeChange: number;
  incomeChangePercent: number;
  expenseChange: number;
  expenseChangePercent: number;
}

export interface AuthResponse {
  access_token: string;
  user?: User; // Optional, in case the API returns user info on login
}
