import { useQuery, useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { queryClient } from '@/lib/queryClient'
import type { User, GoogleOAuthCallbackRequest, AuthResponse } from '@/types'

// ===================================
// 현재 사용자 정보 조회
// ===================================

export const useMe = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      return await apiClient.get<User>('/api/v1/auth/me')
    },
    enabled: apiClient.hasToken(),
  })
}

// ===================================
// Google OAuth Callback 처리
// ===================================

export const useGoogleCallback = () => {
  return useMutation({
    mutationFn: async (data: GoogleOAuthCallbackRequest) => {
      return await apiClient.post<AuthResponse>('/api/v1/auth/google/callback', data)
    },
    onSuccess: (data) => {
      apiClient.setTokens(data.access_token, data.refresh_token)
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      window.location.href = '/'
    },
  })
}

// ===================================
// 로그아웃
// ===================================

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      try {
        await apiClient.post('/api/v1/auth/logout')
      } finally {
        apiClient.clearTokens()
        queryClient.clear()
        window.location.href = '/'
      }
    },
  })
}
