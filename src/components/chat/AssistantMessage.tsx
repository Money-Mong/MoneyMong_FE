/**
 * AssistantMessage - AI 응답 메시지 컴포넌트
 * - 마크다운 지원 (react-markdown + remark-gfm)
 * - 후속 질문 제안
 * - 깔끔한 타이포그래피
 */

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Message } from '@/types'

interface AssistantMessageProps {
  message: Message
  onFollowUpClick?: (question: string) => void
}

export const AssistantMessage = ({ message, onFollowUpClick }: AssistantMessageProps) => {
  return (
    <div className="py-6 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Message Content with Markdown */}
        <div className="prose prose-slate prose-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // 테이블 스타일링 (금융 보고서용)
              table: ({ ...props }) => (
                <table className="border-collapse w-full my-4" {...props} />
              ),
              thead: ({ ...props }) => (
                <thead className="bg-slate-50" {...props} />
              ),
              th: ({ ...props }) => (
                <th className="border border-slate-200 px-4 py-2 text-left font-semibold text-slate-900" {...props} />
              ),
              td: ({ ...props }) => (
                <td className="border border-slate-200 px-4 py-2 text-slate-700" {...props} />
              ),
              // 리스트 스타일링
              ul: ({ ...props }) => (
                <ul className="list-disc list-inside space-y-1 my-3" {...props} />
              ),
              ol: ({ ...props }) => (
                <ol className="list-decimal list-inside space-y-1 my-3" {...props} />
              ),
              // 강조 스타일링
              strong: ({ ...props }) => (
                <strong className="font-semibold text-slate-900" {...props} />
              ),
              em: ({ ...props }) => (
                <em className="italic text-slate-700" {...props} />
              ),
              // 인용구 스타일링
              blockquote: ({ ...props }) => (
                <blockquote className="border-l-4 border-emerald-500 pl-4 py-2 my-4 text-slate-600 italic" {...props} />
              ),
              // 링크 스타일링
              a: ({ ...props }) => (
                <a className="text-emerald-600 hover:text-emerald-700 underline" {...props} />
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Follow-up Questions */}
        {message.follow_up_questions && message.follow_up_questions.length > 0 && (
          <div className="mt-6 space-y-2">
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
              후속 질문
            </p>
            <div className="grid gap-2">
              {message.follow_up_questions.map((question, index) => (
                <button
                  key={index}
                  className="text-left px-4 py-3 text-sm text-slate-700 bg-slate-50 rounded-lg
                           hover:bg-slate-100 transition-colors border border-slate-200
                           hover:border-slate-300"
                  onClick={() => onFollowUpClick?.(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Metadata (optional) */}
        {message.model_version && (
          <div className="mt-4 text-xs text-slate-400">
            {message.model_version}
          </div>
        )}
      </div>
    </div>
  )
}
