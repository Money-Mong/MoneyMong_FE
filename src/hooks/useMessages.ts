import { useQuery, useMutation } from '@tanstack/react-query'
import type { Message, SendMessageRequest } from '@/types'
import { queryClient } from '@/lib/queryClient'
import { mockMessages } from '@/lib/mockData'

// ===================================
// 메시지 목록 조회
// ===================================

export const useMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ['conversations', conversationId, 'messages'],
    queryFn: async () => {
      // TODO: GET /api/v1/conversations/:id/messages (백엔드 미구현)
      // 현재는 mockData 사용
      // 백엔드 완성 후: apiClient.get<Message[]>(`/api/v1/conversations/${conversationId}/messages`)
      return mockMessages[conversationId] || []
    },
    enabled: !!conversationId,
  })
}

// ===================================
// 메시지 전송
// ===================================

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async (data: SendMessageRequest) => {
      // TODO: POST /api/v1/chat/stream
      // - Vercel AI SDK의 useChat 훅 사용 권장
      // - 스트리밍 응답 처리
      console.log('Send message:', data) // 임시로 사용
      return {} as Message
    },
    onSuccess: (_, variables) => {
      // TODO: 해당 대화의 메시지 목록 다시 조회
      queryClient.invalidateQueries({
        queryKey: ['conversations', variables.conversation_id, 'messages']
      })
    },
  })
}
