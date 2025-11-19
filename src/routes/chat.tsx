/**
 * Chat Route - 채팅 화면
 *
 * 두 가지 모드:
 * 1. documentId 있음: 리포트 요약 표시 → 사용자 질문 시 대화 시작
 * 2. conversationId 있음: 기존 대화 이어서 진행
 */

import { createFileRoute, useNavigate } from '@tanstack/react-router' // useNavigate 추가
import { useState, useEffect, useRef } from 'react'
import { useDocumentSummary } from '@/hooks/useDocuments'
import { useMessages, useSendMessage } from '@/hooks/useMessages'
import { useCreateConversation } from '@/hooks/useConversations'
import { ChatInput } from '@/components/chat/ChatInput'
import { AssistantMessage } from '@/components/chat/AssistantMessage'
import { UserMessage } from '@/components/chat/UserMessage'
// import { mockMessages } from '@/lib/mockData' // 더 이상 필요 없음
import type { Message, UserLevel } from '@/types'

// Search params 타입 정의
type ChatSearch = {
  documentId?: string
  conversationId?: string
}

export const Route = createFileRoute('/chat')({
  component: ChatComponent,
  validateSearch: (search: Record<string, unknown>): ChatSearch => ({
    documentId: search.documentId as string | undefined,
    conversationId: search.conversationId as string | undefined,
  }),
})

function ChatComponent() {
  const { documentId, conversationId } = Route.useSearch()
  const navigate = useNavigate() // useNavigate 훅 사용

  const { data: summary, isLoading: summaryLoading } = useDocumentSummary(documentId || '')

  // 메시지 관련 훅 호출
  const { data: fetchedMessages, isLoading: messagesLoading } = useMessages(conversationId || '')
  const { mutateAsync: sendMessage, isPending: isSendingMessage } = useSendMessage() // mutateAsync 사용
  const { mutateAsync: createConversation, isPending: isCreatingConversation } = useCreateConversation() // mutateAsync 사용

  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 기존 대화 로드 (fetchedMessages 사용)
  useEffect(() => {
    if (conversationId && fetchedMessages) {
      setMessages(fetchedMessages)
    } else if (!conversationId) {
      // 새 대화 시작 시 메시지 초기화
      setMessages([])
    }
  }, [conversationId, fetchedMessages])

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleFollowUpClick = (question: string) => {
    setInputValue(question)
  }

  const handleSendMessage = async (content: string, userLevel: UserLevel) => {
    if (!content.trim() || isSendingMessage || isCreatingConversation) {
      return // 내용이 없거나 이미 전송 중이면 아무것도 하지 않음
    }

    // 사용자 메시지를 UI에 즉시 추가 (낙관적 업데이트)
    const userMessage: Message = {
      id: `temp-user-msg-${Date.now()}`, // 임시 ID
      conversation_id: conversationId || 'temp',
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('') // 입력창 비우기

    let currentConversationId = conversationId

    try {
      // 1. documentId는 있지만 conversationId가 없는 경우: 새 대화 생성
      if (!currentConversationId && documentId) {
        const newConversation = await createConversation({
          session_type: 'report_based',
          primary_document_id: documentId,
          title: content.substring(0, 50) + '...' // 첫 메시지로 대화 제목 제안
        })
        currentConversationId = newConversation.id

        // 새 대화 ID로 URL 업데이트
        navigate({ to: '/chat', search: { conversationId: newConversation.id } })
      } else if (!currentConversationId && !documentId) {
        // documentId도 없고 conversationId도 없는 경우: 일반 대화 생성
        const newConversation = await createConversation({
          session_type: 'general',
          title: content.substring(0, 50) + '...' // 첫 메시지로 대화 제목 제안
        })
        currentConversationId = newConversation.id

        // 새 대화 ID로 URL 업데이트
        navigate({ to: '/chat', search: { conversationId: newConversation.id } })
      }

      // 2. 메시지 전송
      if (currentConversationId) {
        await sendMessage({ conversationId: currentConversationId, user_level: userLevel, content })
      } else {
        // 이 경우는 발생해서는 안 되지만, 혹시 모를 상황 대비
        console.error("메시지를 보낼 대화 ID를 찾을 수 없습니다.")
        setMessages((prev) => prev.filter(msg => msg.id !== userMessage.id)) // 사용자 메시지 롤백
      }

    } catch (error) {
      console.error("메시지 전송 또는 대화 생성 중 오류 발생:", error)
      // 오류 발생 시 사용자 메시지 롤백
      setMessages((prev) => prev.filter(msg => msg.id !== userMessage.id))
      // 사용자에게 오류 알림 (예: toast 메시지)
    }
  }

  // 로딩 상태
  const isProcessing = summaryLoading || messagesLoading || isSendingMessage || isCreatingConversation

  if (documentId && summaryLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-sm text-slate-600">문서 요약을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Document Summary (if available) */}
        {summary && messages.length === 0 && (
          <div className="py-8 px-4 bg-emerald-50 border-b border-emerald-100">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                문서 요약
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed mb-4">
                {summary.summary_long}
              </p>

              {summary.key_points && summary.key_points.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">
                    핵심 포인트
                  </p>
                  <ul className="space-y-1">
                    {summary.key_points.map((point, index) => (
                      <li key={index} className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="mt-4 text-sm text-slate-600">
                궁금한 점을 물어보세요.
              </p>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          message.role === 'user' ? (
            <UserMessage key={message.id} message={message} />
          ) : (
            <AssistantMessage
              key={message.id}
              message={message}
              onFollowUpClick={handleFollowUpClick}
            />
          )
        ))}

        {/* Streaming Indicator (isProcessing 상태로 대체) */}
        {isProcessing && (isSendingMessage || isCreatingConversation) && (
          <div className="py-6 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 text-slate-600">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm">AI가 답변을 생성하고 있습니다...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={isProcessing} // isProcessing 상태로 disabled 제어
        value={inputValue}
        onValueChange={setInputValue}
        placeholder={
          summary && messages.length === 0
            ? '문서에 대해 질문해보세요...'
            : '메시지를 입력하세요...'
        }
      />
    </div>
  )
}
