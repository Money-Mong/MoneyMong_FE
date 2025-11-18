import { useQuery, useMutation } from '@tanstack/react-query'
import type { Message, SendMessageRequest, MessageListResponse } from '@/types'
import { queryClient } from '@/lib/queryClient'
import { mockMessages } from '@/lib/mockData'
import { apiClient } from '@/lib/api'

const API_MODE = import.meta.env.VITE_API_MODE

// ===================================
// 메시지 목록 조회
// ===================================

export const useMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ['conversations', conversationId, 'messages'],
    queryFn: async () => {
      if ( API_MODE == 'real') {
        const response = await apiClient.get<MessageListResponse>(`/api/v1/conversations/${conversationId}/messages`)
        return response.items
      } else {
        return mockMessages[conversationId] || []
      }
    },
    enabled: !!conversationId,
  })
}

// ===================================
// 메시지 전송
// ===================================

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async (data: SendMessageRequest & { conversationId: string }) => {
      const { conversationId, ...messageData } = data
      if (!conversationId) {
        throw new Error('Conversation ID is required to send a message.')
      }

      if (API_MODE === 'real') {
        // 올바른 API 엔드포인트로 수정
        const response = await apiClient.post<Message>(
          `/api/v1/conversations/${conversationId}/messages`,
          messageData
        )
        return response
      } else {
        // Mock 데이터 반환
        const newMessage: Message = {
          id: `mock-msg-${Date.now()}`,
          conversation_id: conversationId,
          role: 'assistant', // Mock에서는 바로 AI 응답을 반환하는 것으로 가정
          content: `Mock 응답: "${messageData.content}"에 대한 답변입니다.`,
          created_at: new Date().toISOString(),
        }
        return newMessage
      }
    },
    onSuccess: (_, variables) => {
      // 해당 대화의 메시지 목록 다시 조회
      queryClient.invalidateQueries({
        queryKey: ['conversations', variables.conversationId, 'messages'],
      })
    },
  })
}
