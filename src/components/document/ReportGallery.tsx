/**
 * ReportGallery - 문서 목록 그리드 컴포넌트
 *
 * Notion 스타일 레이아웃:
 * - 반응형 그리드
 * - 명확한 여백과 구획
 * - 로딩/에러 상태 처리
 */

import { useEffect, useMemo, useState } from 'react'
import { ReportCard } from './ReportCard'
import { useDocuments } from '@/hooks/useDocuments'
import { useQueryClient } from '@tanstack/react-query'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { Search, X, ChevronDown } from 'lucide-react'

type SortOption = 'published_date' | 'title'

// 한 페이지당 보여줄 문서 수 (백엔드 page_size와 맞춰야 함)
const PAGE_SIZE = 20

export const ReportGallery = () => {
  const queryClient = useQueryClient()

  // --- 상태 정의 ---
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebouncedValue(searchTerm, 300)
  const [sort, setSort] = useState<SortOption>('published_date')
  const [order, setOrder] = useState<'desc' | 'asc'>('desc')
  const [page, setPage] = useState(1)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // 검색어나 정렬 기준이 바뀌면 항상 1페이지부터 다시 시작
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, sort, order, startDate, endDate])

  // --- API 요청 ---
  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useDocuments({
    search: debouncedSearch || undefined,
    page,
    pageSize: PAGE_SIZE,
    sort,
    order,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  })

  const documents = data?.items ?? []
  const totalDocuments = data?.total ?? 0
  const isSearching = !!debouncedSearch && isFetching
  const hasActiveFilters = Boolean(debouncedSearch || startDate || endDate)
  const totalPages = totalDocuments > 0 ? Math.ceil(totalDocuments / PAGE_SIZE) : 1
  const currentRangeStart =
    totalDocuments === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const currentRangeEnd =
    totalDocuments === 0 ? 0 : Math.min(page * PAGE_SIZE, totalDocuments)

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ['documents'] })
  }

  const showEmptyState = !isLoading && documents.length === 0
  const isFilteredEmpty = showEmptyState && hasActiveFilters

  const emptyStateDescription = useMemo(() => {
    if (isFilteredEmpty) {
      return '조건에 맞는 리포트가 없습니다. 검색어나 기간을 변경해보세요.'
    }
    return '분석 가능한 문서가 아직 없습니다'
  }, [isFilteredEmpty])

  const handleClearSearch = () => setSearchTerm('')
  const handleClearDates = () => {
    setStartDate('')
    setEndDate('')
  }

  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) return []
    return Array.from({ length: totalPages }, (_, idx) => idx + 1)
  }, [totalPages])

  // --- 로딩 상태 ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4" />
          <p className="text-sm text-slate-600">문서 목록을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // --- 에러 상태 ---
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            문서를 불러올 수 없습니다
          </h3>
          <p className="text-sm text-slate-600">
            {(error as Error).message}
          </p>
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

  // --- 성공 상태: 문서 그리드 + 페이지네이션 ---
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold text-slate-900">문서 목록</h2>
          <p className="text-sm text-slate-600 mt-1">
            {isSearching
              ? '검색 중...'
              : totalDocuments > 0
                ? `총 ${totalDocuments}개 중 ${currentRangeStart} - ${currentRangeEnd}번째`
                : '검색 조건에 맞는 문서가 없습니다.'}
          </p>
        </div>

        {/* 검색 입력 */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="제목, 기업명, 키워드로 검색"
            className="w-full pl-9 pr-10 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
          />
          {searchTerm && (
            <button
              type="button"
              aria-label="검색어 지우기"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 정렬 옵션 */}
        <div className="flex items-center gap-2">
          {/* 정렬 기준 */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="w-[120px] appearance-none pl-3 pr-8 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
            >
              <option value="published_date">최신순</option>
              <option value="title">제목순</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>

          {/* 정렬 방향 */}
          <div className="relative">
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value as 'desc' | 'asc')}
              className="w-[100px] appearance-none pl-3 pr-8 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
            >
              <option value="desc">내림차순</option>
              <option value="asc">오름차순</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* 기간 필터 */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <label className="text-xs font-semibold text-slate-500">시작일</label>
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
          />
        </div>
        <div className="flex items-center justify-center text-slate-400">~</div>
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <label className="text-xs font-semibold text-slate-500">종료일</label>
          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(event) => setEndDate(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
          />
        </div>
        {(startDate || endDate) && (
          <button
            onClick={handleClearDates}
            className="px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            기간 초기화
          </button>
        )}
      </div>

      {/* Grid / Empty */}
      {documents.length === 0 ? (
        <div className="flex items-center justify-center rounded-xl border border-dashed border-slate-200 py-16">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {isFilteredEmpty ? '검색 결과 없음' : '리포트가 없습니다'}
            </h3>
            <p className="text-sm text-slate-600">{emptyStateDescription}</p>
            {/* {debouncedSearch && (
              <button
                onClick={handleClearSearch}
                className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              >
                검색어 초기화
              </button>
            )} */}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <ReportCard key={doc.id} document={doc} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pageNumbers.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-slate-100">
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                pageNumber === page
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      )}

    </div>
  )
}
