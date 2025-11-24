import { useQuery } from '@tanstack/react-query'
import type { Document, DocumentSummary, DocumentListResponse, DocumentWithSummary } from '@/types'
import { mockDocuments, mockSummaries } from '@/lib/mockData'

import { apiClient } from '@/lib/api'

const API_MODE = import.meta.env.VITE_API_MODE

type DocumentListParams = {
  search?: string
  page?: number
  pageSize?: number
  sort?: 'created_at' | 'published_date' | 'title'
  order?: 'asc' | 'desc'
  startDate?: string
  endDate?: string
}
// ===================================
// 리포트 목록 조회
// ===================================

export const useDocuments = (params?: DocumentListParams) => {
  const search = params?.search?.trim() ?? ''
  const page = params?.page ?? 1
  const pageSize = params?.pageSize ?? 20
  const sort = params?.sort ?? 'published_date'
  const order = params?.order ?? 'desc'
  const startDate = params?.startDate ?? ''
  const endDate = params?.endDate ?? ''

  return useQuery<DocumentListResponse>({
    queryKey: ['documents', { search, page, pageSize, sort, order, startDate, endDate }],
    queryFn: async () => {
      if (API_MODE === 'real') {
        const response = await apiClient.get<DocumentListResponse>('/api/v1/documents', {
          params: {
            search: search || undefined,
            page,
            page_size: pageSize,
            sort,
            order,
            start_date: startDate || undefined,
            end_date: endDate || undefined,
          },
        })
        return response
      } else {
        let filtered = mockDocuments

        if (search) {
          const normalized = search.toLowerCase()
          filtered = filtered.filter((doc) => {
            const titleMatch = doc.title.toLowerCase().includes(normalized)
            const authorMatch = doc.author?.toLowerCase().includes(normalized)
            const metadataMatch = JSON.stringify(doc.metadata || {})
              .toLowerCase()
              .includes(normalized)
            return titleMatch || authorMatch || metadataMatch
          })
        }

        if (startDate) {
          const startTime = new Date(startDate).getTime()
          filtered = filtered.filter((doc) => {
            const published = doc.published_date ? new Date(doc.published_date).getTime() : undefined
            return published ? published >= startTime : false
          })
        }

        if (endDate) {
          const endTime = new Date(endDate).getTime()
          filtered = filtered.filter((doc) => {
            const published = doc.published_date ? new Date(doc.published_date).getTime() : undefined
            return published ? published <= endTime : false
          })
        }

        // 정렬 모방
        if (sort === 'published_date') {
          filtered = [...filtered].sort((a, b) => {
            if (!a.published_date || !b.published_date) return 0
            const da = new Date(a.published_date).getTime()
            const db = new Date(b.published_date).getTime()
            return order === 'asc' ? da - db : db - da
          })
        } else if (sort === 'title') {
          filtered = [...filtered].sort((a, b) => {
            return order === 'asc'
              ? a.title.localeCompare(b.title)
              : b.title.localeCompare(a.title)
          })
        }

        // pagination 모방
        const start = (page - 1) * pageSize
        const end = start + pageSize

        const pagedItems = filtered.slice(start, end).map((doc) => {
          const summary = mockSummaries[doc.id]
          return {
            ...doc,
            summary,
          } as DocumentWithSummary
        })

        return {
          total: filtered.length,
          items: pagedItems,
        }
      }
    },
  })
}

// 리포트 상세 조회
export const useDocument = (documentId: string) => {
  return useQuery({
    queryKey: ['documents', documentId],
    queryFn: async () => {
      if( API_MODE == 'real') {
        return apiClient.get<Document>(`/api/v1/documents/${documentId}`)
      } else {
        const document = mockDocuments.find((doc) => doc.id === documentId)
        if (!document) {
          throw new Error(`Document not found: ${documentId}`)
        }
        return document
      }
    },
    enabled: !!documentId,
  })
}

// =리포트 요약조회=

export const useDocumentSummary = (documentId: string) => {
  return useQuery({
    queryKey: ['documents', documentId, 'summary'],
    queryFn: async () => {
      if( API_MODE == 'real') {
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
