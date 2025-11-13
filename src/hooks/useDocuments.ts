import { useQuery } from '@tanstack/react-query'
import type { Document, DocumentSummary } from '@/types'
import { mockDocuments, mockSummaries } from '@/lib/mockData'

// ===================================
// 리포트 목록 조회
// ===================================

export const useDocuments = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      // TODO: GET /api/v1/documents (백엔드 미구현)
      // 현재는 mockData 사용
      // 백엔드 완성 후: apiClient.get<Document[]>('/api/v1/documents')
      return mockDocuments
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
      // TODO: GET /api/v1/documents/:id
      // 현재는 mockData 사용
      // 백엔드 완성 후: apiClient.get<Document>(`/api/v1/documents/${documentId}`)
      const document = mockDocuments.find(doc => doc.id === documentId)
      if (!document) {
        throw new Error(`Document not found: ${documentId}`)
      }
      return document as Document
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
      // TODO: GET /api/v1/documents/:id/summary
      // 현재는 mockData 사용
      // 백엔드 완성 후: apiClient.get<DocumentSummary>(`/api/v1/documents/${documentId}/summary`)
      const summary = mockSummaries[documentId]
      if (!summary) {
        throw new Error(`Document summary not found: ${documentId}`)
      }
      return summary as DocumentSummary
    },
    enabled: !!documentId,
  })
}
