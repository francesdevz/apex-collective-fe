
import axios from "axios";
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

class ApiService {
  static REFRESH_TOKEN_WAIT_DURATION = 1000; 
  static REFRESH_TOKEN_WAIT_ATTEMPTS = 200; 

  private static instance: ApiService;
  private service: AxiosInstance;
  private _isRefreshingToken: false | Promise<void> = false;

  private constructor() {
    this.service = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.service.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.service.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            if (this._isRefreshingToken) {
              await this._isRefreshingToken;
            } else {
              this._isRefreshingToken = this.refreshToken();
              await this._isRefreshingToken;
              this._isRefreshingToken = false;
            }

            const token = localStorage.getItem("accessToken");
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return this.service(originalRequest);
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
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

    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });

    const { accessToken, newRefreshToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
    }
  }

  private clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  public get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.service.get<T>(url, config);
  }

  public post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.service.post<T>(url, data, config);
  }

  public put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.service.put<T>(url, data, config);
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.service.delete<T>(url, config);
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }
}

export default ApiService;
