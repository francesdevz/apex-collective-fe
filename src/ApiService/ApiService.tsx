import axios from "axios";
import type { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

class ApiService {
  private static instance: ApiService;
  private service: AxiosInstance | null = null; 
  private baseURL: string;

  private constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    this.initializeService();
  }

  private initializeService(): void {
    try {
      console.log('🔧 Initializing Axios service...');
      this.service = axios.create({
        baseURL: this.baseURL,
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      this.setupInterceptors();
    } catch (error) {
      throw error;
    }
  }

  private setupInterceptors(): void {
    if (!this.service) {
      throw new Error('Service not initialized before setting up interceptors');
    }
    this.service.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.service.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: AxiosError) => {
      
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await this.refreshToken();
            const token = localStorage.getItem("accessToken");
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return this.service!(originalRequest);
          } catch (refreshError) {
            this.clearTokens();
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token available");
    const response = await this.service!.post('/auth/refresh', { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    if (newRefreshToken) {
      localStorage.setItem("refreshToken", newRefreshToken);
    }
  }

  private clearTokens(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  private ensureServiceInitialized(): AxiosInstance {
    if (!this.service) {
      this.initializeService();
      if (!this.service) {
        throw new Error('ApiService failed to initialize Axios instance');
      }
    }
    return this.service;
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const service = this.ensureServiceInitialized();
    const response = await service.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: unknown): Promise<T> {
    const service = this.ensureServiceInitialized();
    const response = await service.post<T>(url, data);
    return response.data;
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const service = this.ensureServiceInitialized();
    const response = await service.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const service = this.ensureServiceInitialized();
    const response = await service.delete<T>(url, config);
    return response.data;
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    } 
    return ApiService.instance;
  }
}

export default ApiService;