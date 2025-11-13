import { useQuery, useMutation } from '@tanstack/react-query'
import type { Conversation, CreateConversationRequest } from '@/types'
import { queryClient } from '@/lib/queryClient'
import { mockConversations } from '@/lib/mockData'

// ===================================
// 채팅 이력 목록 조회
// ===================================

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      // TODO: GET /api/v1/conversations (백엔드 미구현)
      // 현재는 mockData 사용
      // 백엔드 완성 후: apiClient.get<Conversation[]>('/api/v1/conversations')
      return mockConversations
    },
  })
}

// ===================================
// 채팅 상세 조회
// ===================================

export const useConversation = (conversationId: string) => {
  return useQuery({
    queryKey: ['conversations', conversationId],
    queryFn: async () => {
      // TODO: GET /api/v1/conversations/:id (백엔드 미구현)
      // 현재는 mockData 사용
      // 백엔드 완성 후: apiClient.get<Conversation>(`/api/v1/conversations/${conversationId}`)
      const conversation = mockConversations.find(conv => conv.id === conversationId)
      if (!conversation) {
        throw new Error(`Conversation not found: ${conversationId}`)
      }
      return conversation
    },
    enabled: !!conversationId,
  })
}

// ===================================
// 새 채팅 생성
// ===================================

export const useCreateConversation = () => {
  return useMutation({
    mutationFn: async (data: CreateConversationRequest) => {
      // TODO: POST /api/v1/conversations
      // - session_type: 'general' | 'report_based'
      // - primary_document_id (optional)
      console.log('Create conversation:', data) // 임시로 사용
      return {} as Conversation
    },
    onSuccess: () => {
      // TODO: conversations 목록 다시 조회
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}
