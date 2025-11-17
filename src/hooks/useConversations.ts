import { useQuery, useMutation } from '@tanstack/react-query'
import type { Conversation, CreateConversationRequest, ConversationListResponse } from '@/types'
import { queryClient } from '@/lib/queryClient'
import { mockConversations } from '@/lib/mockData'
import { apiClient } from '@/lib/api'

const API_MODE = import.meta.env.VITE_API_MODE
// ===================================
// 채팅 이력 목록 조회
// ===================================

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      if(API_MODE == 'real') {
        const response = await apiClient.get<ConversationListResponse>('/api/v1/conversations')
        return response.items
      } else {
        return mockConversations
      }
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
      if(API_MODE == 'real') {
        return apiClient.get<Conversation>(`/api/v1/conversations/${conversationId}`)
      } else {
        const conversation = mockConversations.find(conv => conv.id === conversationId)
        if (!conversation) {
          throw new Error(`Conversation not found: ${conversationId}`)
        }
        return conversation
      }
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

      console.log('Create conversation:', data)
      if(API_MODE == 'real') {
        const response = await apiClient.post<Conversation>('/api/v1/conversations', data)
        return response
      } else {
        const newConversation: Conversation = {
          id: `mock-conv-${mockConversations.length+1}`,
          title: data.title|| '신규 Mock 대화',
          user_id: '',
          session_type: 'general',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        mockConversations.push(newConversation)
        return newConversation
      }
      return {} as Conversation
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}
