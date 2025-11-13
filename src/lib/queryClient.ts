import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5분 동안 데이터 fresh 상태 유지
      gcTime: 10 * 60 * 1000,     // 10분 동안 캐시 보관
      retry: 1,                   // 실패 시 1회 재시도
      refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 refetch 비활성화
    },
    mutations: {
      retry: 0, // Mutation은 재시도 안함
    },
  },
})
