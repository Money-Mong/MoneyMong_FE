/**
 * ReportCard - 문서 카드 컴포넌트
 *
 * Linear 스타일 디자인 가이드 적용:
 * - 절제된 색상 (slate 계열)
 * - 미니멀한 border, shadow
 * - 명확한 타이포그래피 위계
 */

import { Link } from '@tanstack/react-router'
import { FileText, Calendar, User } from 'lucide-react'
import type { Document } from '@/types'

interface ReportCardProps {
  document: Document
}

export const ReportCard = ({ document }: ReportCardProps) => {
  // TODO: 상태관리
  // 1. processing_status에 따른 UI 상태 표시
  //    - pending: 대기 중 표시
  //    - processing: 로딩 스피너
  //    - failed: 에러 메시지
  // 2. source_type별 아이콘 다르게 표시 (pdf, url, text)
  // 3. hover 애니메이션 개선 (transform scale 등)

  return (
    <Link
      to="/chat"
      search={{ documentId: document.id }}
      className="group block"
    >
      <article className="p-6 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 text-slate-600">
            <FileText className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              {document.source_type}
            </span>
          </div>

          {/* Status Badge */}
          {document.processing_status !== 'completed' && (
            <span className={`
              px-2 py-1 text-xs font-medium rounded
              ${document.processing_status === 'pending' ? 'bg-slate-100 text-slate-600' : ''}
              ${document.processing_status === 'processing' ? 'bg-emerald-50 text-emerald-700' : ''}
              ${document.processing_status === 'failed' ? 'bg-red-50 text-red-700' : ''}
            `}>
              {document.processing_status === 'pending' && '대기중'}
              {document.processing_status === 'processing' && '처리중'}
              {document.processing_status === 'failed' && '실패'}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
          {document.title}
        </h3>

        {/* Metadata */}
        <div className="flex flex-col gap-2 text-sm text-slate-600">
          {document.author && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{document.author}</span>
            </div>
          )}

          {document.published_date && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(document.published_date).toLocaleDateString('ko-KR')}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            {document.total_pages ? `${document.total_pages}페이지` : document.language}
          </span>
          <span className="text-emerald-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            분석하기 →
          </span>
        </div>
      </article>
    </Link>
  )
}
