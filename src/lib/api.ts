import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosError, type AxiosResponse } from 'axios'
import type { AuthResponse, RefreshTokenRequest } from '@/types'
import {queryClient} from '@/lib/queryClient'

// TODO: 환경변수로 API URL 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request Interceptor: JWT 토큰을 Authorization 헤더에 자동 추가
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getAccessToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        return config;
      }
    )

    // Response Interceptor: 401 에러 시 Refresh Token으로 자동 갱신
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response, // 성공 응답은 그대로 통과

      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        // 401 토큰 에러인데 재시도안한 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          const refreshToken = this.getRefreshToken()

          if (refreshToken) {
            try {
              const response = await this.refreshAccessToken(refreshToken)

              this.setTokens(response.access_token, response.refresh_token)

              originalRequest.headers.Authorization = `Bearer ${response.access_token}`

              return this.client(originalRequest)
            } catch (refreshError) {
              this.clearTokens()
              queryClient.clear()
 
              // 이미 로그인 페이지에 있으면 리다이렉트 방지
              if (!window.location.pathname.includes('/auth/login')) {
                window.location.href = '/auth/login'
              }
              return Promise.reject(refreshError)
            }
          }
        }
        return Promise.reject(error)
      }
    )
  }

  // ===================================
  // Token Management
  // ===================================

  private getAccessToken(): string | null {
    if(typeof window === 'undefined') {
      return null;
    }
    return window.localStorage.getItem('access_token')
  }

  private getRefreshToken(): string | null {
    if(typeof window === 'undefined') {
      return null;
    }
    return window.localStorage.getItem('refresh_token')
  }

  setTokens(accessToken: string, refreshToken?: string) {
    if(typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem('access_token', accessToken)
    if(refreshToken) {
      window.localStorage.setItem('refresh_token', refreshToken)
    }
  }

  clearTokens() {
    if(typeof window === 'undefined') {
      return;
    }
    window.localStorage.removeItem('access_token')
    window.localStorage.removeItem('refresh_token')
  }

  hasToken(): boolean {
    return !!this.getAccessToken()
  }
  // ===================================
  // Auth APIs
  // ===================================

  async refreshAccessToken(refreshToken: string): Promise<AuthResponse> {
    // axios 직접 사용 (this.client 사용 시 interceptor 무한 루프 발생)
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/api/v1/auth/refresh`,
      { refresh_token: refreshToken } as RefreshTokenRequest
    )

    return response.data
  }

  // ===================================
  // Generic Request Methods
  // ===================================

  async get<T>(url: string, config = {}) {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  async post<T>(url: string, data = {}, config = {}) {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  async put<T>(url: string, data = {}, config = {}) {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config = {}) {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }
}

export const apiClient = new ApiClient()
