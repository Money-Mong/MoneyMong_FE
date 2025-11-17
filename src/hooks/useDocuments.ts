import { useQuery } from '@tanstack/react-query'
import type { Document, DocumentSummary, DocumentListResponse } from '@/types'
import { mockDocuments, mockSummaries } from '@/lib/mockData'

import { apiClient } from '@/lib/api'

const API_MODE = import.meta.env.VITE_API_MODE
// ===================================
// 리포트 목록 조회
// ===================================

export const useDocuments = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      if( API_MODE == 'real') {
        const response = await apiClient.get<DocumentListResponse>('/api/v1/documents')
        return response.items
      } else {
        return mockDocuments
      }
    },
  })
}

// ===================================
// 리포트 상세 조회
// ===================================

export const useDocument = (documentId: string) => {
  return useQuery({
    queryKey: ['documents', documentId],
    queryFn: async () => {
      if ( API_MODE == 'real') {
        return apiClient.get<Document>(`/api/v1/documents/${documentId}`)
      } else {
        const document = mockDocuments.find(doc => doc.id === documentId)
        if (!document) {
          throw new Error(`Document not found: ${documentId}`)
        }
        return document as Document
      }
    },
    enabled: !!documentId,
  })
}

// ===================================
// 리포트 요약 조회
// ===================================

export const useDocumentSummary = (documentId: string) => {
  return useQuery({
    queryKey: ['documents', documentId, 'summary'],
    queryFn: async () => {
      if ( API_MODE == 'real') {
        return apiClient.get<DocumentSummary>(`/api/v1/documents/${documentId}/summary`)
      } else {
        const summary = mockSummaries[documentId]
        if (!summary) {
          throw new Error(`Document summary not found: ${documentId}`)
        }
        return summary as DocumentSummary
      }
    },
    enabled: !!documentId,
  })
}
