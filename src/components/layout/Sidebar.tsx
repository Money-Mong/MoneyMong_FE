/**
 * Sidebar - 채팅 이력 사이드바
 *
 * Linear 스타일 적용:
 * - 미니멀한 리스트
 * - 명확한 구분
 */

import { Link, useNavigate } from '@tanstack/react-router'
import { useConversations } from '@/hooks/useConversations'
import { MessageSquare, Plus } from 'lucide-react'

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const { data: conversations, isLoading } = useConversations()
  const navigate = useNavigate()

  const handleNewConversation = () => {
    // 새 대화 시작 - chat 페이지로 이동 (documentId, conversationId 없이)
    navigate({ to: '/chat' })
    onClose?.()
  }

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <button
          onClick={handleNewConversation}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          새 대화
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-sm text-slate-500">로딩중...</div>
          </div>
        ) : conversations && conversations.length > 0 ? (
          conversations.map((conversation) => (
            <Link
              key={conversation.id}
              to="/chat"
              search={{ conversationId: conversation.id }}
              onClick={() => onClose?.()}
              className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 mt-0.5 text-slate-400" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {conversation.title || '제목 없는 대화'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {conversation.session_type === 'report_based' ? '문서 기반' : '일반 대화'}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm text-slate-500">대화 이력이 없습니다</p>
          </div>
        )}
      </div>

      {/* TODO: 대화 관리 및 페이지네이션
       * 1. 대화 검색 기능
       * 2. 대화 삭제 기능
       * 3. 대화 정렬 옵션 (최신순, 오래된순)
       * 4. 무한 스크롤 or 페이지네이션
       */}
    </aside>
  )
}
