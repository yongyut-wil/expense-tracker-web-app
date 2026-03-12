import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ApiResponse } from "@/types";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  console.log(
    `🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    config.data || "",
  );
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Show toast notification before redirect
        const isThai = window.location.pathname.startsWith("/th");
        const sessionMsg = isThai 
          ? "เซสชั่นหมดอายุ กรุณาเข้าสู่ระบบใหม่" 
          : "Session expired, please login again";
          
        toast.error(sessionMsg, {
          duration: 3000,
        });

        // Clear token from localStorage and store
        localStorage.removeItem("token");
        useAuthStore.getState().logout();

        // Small delay to let user see the toast
        setTimeout(() => {
          window.location.href = isThai ? "/th/login" : "/en/login";
        }, 1500);
      }
    }
    return Promise.reject(error);
  },
);

export async function fetcher<T>(url: string): Promise<T | null> {
  try {
    const response = await api.get<ApiResponse<T>>(url);
    if (!response.data.success) {
      throw new Error(response.data.error?.message || "Unknown error");
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export default api;
