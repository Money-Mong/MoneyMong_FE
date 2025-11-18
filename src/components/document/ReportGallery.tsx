/**
 * ReportGallery - 문서 목록 그리드 컴포넌트
 *
 * Notion 스타일 레이아웃:
 * - 반응형 그리드
 * - 명확한 여백과 구획
 * - 로딩/에러 상태 처리
 */

import { ReportCard } from './ReportCard'
import { useDocuments } from '@/hooks/useDocuments'
import { useQueryClient } from '@tanstack/react-query'

export const ReportGallery = () => {
  const queryClient = useQueryClient()
  const { data: documents, isLoading, error } = useDocuments()

  const handleRetry = () => {
    queryClient.invalidateQueries({queryKey: ['documents']})
  }
  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-sm text-slate-600">문서 목록을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">문서를 불러올 수 없습니다</h3>
          <p className="text-sm text-slate-600">{error.message}</p>
          <button 
              onClick={handleRetry}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
            >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  // Empty State
  if (!documents || documents.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">리포트가 없습니다</h3>
          <p className="text-sm text-slate-600">
            분석 가능한 문서가 아직 없습니다
          </p>
        </div>
      </div>
    )
  }

  // Success State - Document Grid
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">문서 목록</h2>
          <p className="text-sm text-slate-600 mt-1">
            총 {documents.length}개의 문서
          </p>
        </div>

        {/* TODO: 문서 검색 심화
         * 1. 정렬 옵션 추가 (최신순, 제목순 등)
         * 2. 검색 기능 구현
         * 3. 필터링 옵션 (source_type, processing_status)
         */}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <ReportCard key={doc.id} document={doc} />
        ))}
      </div>
    </div>
  )
}
