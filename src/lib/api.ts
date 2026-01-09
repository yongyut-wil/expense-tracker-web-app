import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
       if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
       }
    }
    return Promise.reject(error);
  }
);

export async function fetcher<T>(url: string): Promise<T | null> {
  try {
    const response = await api.get<ApiResponse<T>>(url);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Unknown error');
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export default api;
