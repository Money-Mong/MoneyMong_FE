/**
 * Chat Route - 채팅 화면
 *
 * 두 가지 모드:
 * 1. documentId 있음: 2단 레이아웃 (채팅 + 컨텍스트 패널)
 *    - 컨텍스트 패널: 문서 요약과 원본 PDF 뷰어를 탭으로 제공
 * 2. documentId 없음: 1단 레이아웃 (일반 채팅)
 */
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import { clsx } from 'clsx'
import { useDocument, useDocumentSummary } from '@/hooks/useDocuments'
import { useMessages, useSendMessage } from '@/hooks/useMessages'
import { useCreateConversation, useConversation } from '@/hooks/useConversations'
import { ChatInput } from '@/components/chat/ChatInput'
import { AssistantMessage } from '@/components/chat/AssistantMessage'
import { UserMessage } from '@/components/chat/UserMessage'
import { PdfViewer } from '@/components/chat/PdfViewer'
import type { Message, UserLevel, DocumentSummary as Summary } from '@/types'

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
  const navigate = useNavigate()

  // ===================================
  // 데이터 조회 Hooks
  // ===================================

  // 대화 상세 정보 조회 (기존 대화인 경우)
  const { data: conversation } = useConversation(conversationId || '')

  // 유효한 documentId 결정 (URL 파라미터 우선, 없으면 대화 정보에서 가져옴)
  const effectiveDocumentId = documentId || conversation?.primary_document_id || ''

  const { data: summary, isLoading: summaryLoading } = useDocumentSummary(effectiveDocumentId)
  const { data: document, isLoading: documentLoading } = useDocument(effectiveDocumentId)
  const { data: fetchedMessages, isLoading: messagesLoading } = useMessages(conversationId || '')
  const { mutateAsync: sendMessage, isPending: isSendingMessage } = useSendMessage()
  const { mutateAsync: createConversation, isPending: isCreatingConversation } = useCreateConversation()

  // ===================================
  // 상태 관리
  // ===================================
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [activeTab, setActiveTab] = useState<'summary' | 'pdf'>('summary')
  const [mobileTab, setMobileTab] = useState<'chat' | 'summary' | 'pdf'>('chat')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // ===================================
  // Effects
  // ===================================
  // 기존 대화 로드
  useEffect(() => {
    if (conversationId && fetchedMessages) {
      setMessages(fetchedMessages)
    } else if (!conversationId) {
      setMessages([])
    }
  }, [conversationId, fetchedMessages])

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ===================================
  // 핸들러 함수
  // ===================================
  const handleFollowUpClick = (question: string) => {
    setInputValue(question)
  }

  const handleSendMessage = async (content: string, userLevel: UserLevel) => {
    if (!content.trim() || isSendingMessage || isCreatingConversation) return

    const userMessage: Message = {
      id: `temp-user-msg-${Date.now()}`,
      conversation_id: conversationId || 'temp',
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    let currentConversationId = conversationId

    try {
      if (!currentConversationId) {
        const newConversation = await createConversation({
          session_type: effectiveDocumentId ? 'report_based' : 'general',
          primary_document_id: effectiveDocumentId || undefined,
          title: content.substring(0, 50) + '...',
        })
        currentConversationId = newConversation.id

        // 새 대화 ID로 URL 업데이트 (documentId 유지)
        navigate({ to: '/chat', search: { documentId: effectiveDocumentId || undefined, conversationId: newConversation.id } })
      }

      if (currentConversationId) {
        await sendMessage({ conversationId: currentConversationId, user_level: userLevel, content })
      } else {
        throw new Error("메시지를 보낼 대화 ID를 찾을 수 없습니다.")
      }
    } catch (error) {
      console.error("메시지 전송 또는 대화 생성 중 오류 발생:", error)
      setMessages((prev) => prev.filter(msg => msg.id !== userMessage.id))
    }
  }

  // ===================================
  // 렌더링 로직
  // ===================================
  const isProcessing = summaryLoading || messagesLoading || isSendingMessage || isCreatingConversation || documentLoading
  const isInitialLoading = (summaryLoading || documentLoading) && effectiveDocumentId

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-sm text-slate-600">문서 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  const chatArea = (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4">
        {messages.map((message) =>
          message.role === 'user' ? (
            <UserMessage key={message.id} message={message} />
          ) : (
            <AssistantMessage key={message.id} message={message} onFollowUpClick={handleFollowUpClick} />
          ),
        )}
        {isProcessing && (isSendingMessage || isCreatingConversation) && (
          <div className="py-6">
            <div className="flex items-center gap-2 text-slate-600">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-sm">AI가 답변을 생성하고 있습니다...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={isProcessing}
        value={inputValue}
        onValueChange={setInputValue}
        placeholder={effectiveDocumentId ? '문서에 대해 질문해보세요...' : '메시지를 입력하세요...'}
      />
    </div>
  )

  const contextPanel = (
    <div className="flex flex-col h-full border-l border-slate-200 bg-slate-50">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('summary')}
          className={clsx(
            "flex-1 py-2.5 text-sm font-semibold",
            activeTab === 'summary' ? 'text-emerald-600 bg-white' : 'text-slate-500 hover:bg-slate-100'
          )}
        >
          요약
        </button>
        <button
          onClick={() => setActiveTab('pdf')}
          className={clsx(
            "flex-1 py-2.5 text-sm font-semibold",
            activeTab === 'pdf' ? 'text-emerald-600 bg-white' : 'text-slate-500 hover:bg-slate-100'
          )}
        >
          원본 PDF
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto relative">
        {summary && (
          <div className={clsx(
            "absolute inset-0 overflow-y-auto",
            activeTab === 'summary' ? "z-10" : "z-0 pointer-events-none opacity-0"
          )}>
            <DocumentSummary summary={summary} />
          </div>
        )}
        {document?.file_path && (
          <div className={clsx(
            "absolute inset-0",
            activeTab === 'pdf' ? "z-10" : "z-0 pointer-events-none opacity-0"
          )}>
            <PdfViewer fileUrl={document.file_path} />
          </div>
        )}
        {activeTab === 'pdf' && !document?.file_path && (
          <div className="p-4 text-center text-sm text-slate-500">
            PDF 경로를 찾을 수 없습니다.
          </div>
        )}
      </div>
    </div>
  )

  // No document: Render only chat area
  if (!effectiveDocumentId) {
    return <div className="h-full">{chatArea}</div>;
  }

  // With document: Render responsive layout
  return (
    <>
      {/* Desktop Layout: Side-by-side */}
      <div className="hidden h-full overflow-hidden md:flex">
        <div className="flex-1 h-full min-w-0">{chatArea}</div>
        <div className="h-full w-[35%] flex-shrink-0">{contextPanel}</div>
      </div>

      {/* Mobile Layout: Tabs */}
      <div className="md:hidden h-full flex flex-col">
        {/* Mobile Tab Navigation */}
        <div className="flex border-b border-slate-200 flex-shrink-0">
          <button
            onClick={() => setMobileTab('chat')}
            className={clsx(
              'flex-1 py-2.5 text-sm font-semibold',
              mobileTab === 'chat' ? 'text-emerald-600 bg-white' : 'text-slate-500 hover:bg-slate-100'
            )}
          >
            채팅
          </button>
          <button
            onClick={() => setMobileTab('summary')}
            className={clsx(
              'flex-1 py-2.5 text-sm font-semibold',
              mobileTab === 'summary' ? 'text-emerald-600 bg-white' : 'text-slate-500 hover:bg-slate-100'
            )}
          >
            요약
          </button>
          <button
            onClick={() => setMobileTab('pdf')}
            className={clsx(
              'flex-1 py-2.5 text-sm font-semibold',
              mobileTab === 'pdf' ? 'text-emerald-600 bg-white' : 'text-slate-500 hover:bg-slate-100'
            )}
          >
            원본 PDF
          </button>
        </div>

        {/* Mobile Tab Content */}
        <div className="flex-1 overflow-hidden relative">
          <div className={clsx(
            "absolute inset-0",
            mobileTab === 'chat' ? "z-10" : "z-0 pointer-events-none opacity-0"
          )}>
            {chatArea}
          </div>
          {summary && (
            <div className={clsx(
              "absolute inset-0 overflow-y-auto",
              mobileTab === 'summary' ? "z-10" : "z-0 pointer-events-none opacity-0"
            )}>
              <DocumentSummary summary={summary} />
            </div>
          )}
          {document?.file_path && (
            <div className={clsx(
              "absolute inset-0",
              mobileTab === 'pdf' ? "z-10" : "z-0 pointer-events-none opacity-0"
            )}>
              <PdfViewer fileUrl={document.file_path} />
            </div>
          )}
          {mobileTab === 'pdf' && !document?.file_path && (
            <div className="p-4 text-center text-sm text-slate-500">
              PDF 경로를 찾을 수 없습니다.
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ===================================
// Sub-components
// ===================================

function DocumentSummary({ summary }: { summary: Summary }) {
  const sanitizeTaggedText = (text: string | undefined) => {
    if (!text) return ''
    return text.replace(/<[^>]*>/g, '').trim()
  }

  const extractTagContent = (text: string | undefined, tag: string) => {
    if (!text) return ''
    const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i')
    const match = text.match(regex)
    if (match?.[1]) {
      return match[1].trim()
    }
    return ''
  }

  const extractList = (text: string | undefined, parentTag: string, childTag: string) => {
    const parentContent = extractTagContent(text, parentTag)
    if (!parentContent) return []
    const regex = new RegExp(`<${childTag}>([\\s\\S]*?)<\\/${childTag}>`, 'gi')
    const matches = parentContent.match(regex)
    if (!matches) return []
    return matches.map((m) =>
      m.replace(new RegExp(`<${childTag}>|<\\/${childTag}>`, 'gi'), '').trim(),
    )
  }

  const mainTopic = extractTagContent(summary.summary_long, 'main_topic')
  const keyPoints = extractList(summary.summary_long, 'key_points', 'key_point')
  const keyTerms = extractList(summary.summary_long, 'key_terms', 'key_term')

  // Fallback if no XML structure is found
  if (!mainTopic && keyPoints.length === 0 && keyTerms.length === 0) {
    return (
      <div className="p-5">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">문서 요약</h2>
        <p className="text-sm text-slate-700 leading-relaxed mb-4">
          {sanitizeTaggedText(summary.summary_long)}
        </p>

        {summary.key_points && summary.key_points.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">
              핵심 포인트
            </p>
            <ul className="space-y-1">
              {summary.key_points.map((point, index) => (
                <li
                  key={index}
                  className="text-sm text-slate-700 flex items-start gap-2"
                >
                  <span className="text-emerald-600 mt-1">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-5">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">문서 요약</h2>

      {mainTopic && (
        <div className="mb-6">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
            핵심 주제
          </div>
          <p className="text-sm text-slate-800 font-medium leading-relaxed bg-emerald-50 p-3 rounded-md border border-emerald-100">
            {mainTopic}
          </p>
        </div>
      )}

      {keyPoints.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">
            핵심 정보
          </p>
          <ul className="space-y-2">
            {keyPoints.map((point, index) => (
              <li
                key={index}
                className="text-sm text-slate-700 flex items-start gap-2"
              >
                <span className="text-emerald-600 mt-1.5 shrink-0">•</span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {keyTerms.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">
            주요 용어
          </p>
          <div className="flex flex-wrap gap-2">
            {keyTerms.map((term, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
