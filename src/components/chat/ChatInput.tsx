/**
 * ChatInput - 텍스트 채팅 입력 컴포넌트
 *
 * Linear 스타일 적용:
 * - 미니멀한 입력창
 * - 명확한 전송 버튼
 * - 사용자 레벨 선택
 * - 부드러운 인터랙션
 */

import { useState } from 'react'
import { Send, GraduationCap } from 'lucide-react'
import type { UserLevel } from '@/types/chat'

interface ChatInputProps {
  onSend: (message: string, userLevel: UserLevel) => void
  disabled?: boolean
  placeholder?: string
  value?: string
  onValueChange?: (value: string) => void
  userLevel?: UserLevel
  onUserLevelChange?: (level: UserLevel) => void
}

export const ChatInput = ({
  onSend,
  disabled = false,
  placeholder = '메시지를 입력하세요...',
  value: externalValue,
  onValueChange,
  userLevel: externalUserLevel,
  onUserLevelChange,
}: ChatInputProps) => {
  const [internalMessage, setInternalMessage] = useState('')
  const [internalUserLevel, setInternalUserLevel] = useState<UserLevel>('beginner')

  // Controlled or uncontrolled mode
  const message = externalValue !== undefined ? externalValue : internalMessage
  const setMessage = (value: string) => {
    if (onValueChange) {
      onValueChange(value)
    } else {
      setInternalMessage(value)
    }
  }

  const userLevel = externalUserLevel !== undefined ? externalUserLevel : internalUserLevel
  const setUserLevel = (level: UserLevel) => {
    if (onUserLevelChange) {
      onUserLevelChange(level)
    } else {
      setInternalUserLevel(level)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (message.trim() && !disabled) {
      onSend(message.trim(), userLevel)
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter: 전송
    // Shift+Enter: 줄바꿈
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const levelLabels = {
    beginner: '해설',
    intermediate: '요약',
    advanced: '전문',
  }

  const levelDescriptions = {
    beginner: '쉽게 설명해주세요',
    intermediate: '핵심만 요약해주세요',
    advanced: '전문적으로 분석해주세요',
  }
  const activeLevelStyles = {
    beginner: 'bg-blue-500 text-white shadow-sm focus:ring-blue-500',
    intermediate: 'bg-yellow-500 text-white shadow-sm focus:ring-yellow-500',
    advanced: 'bg-emerald-500 text-white shadow-sm focus:ring-emerald-500',
  };
  
  const inactiveStyles = 'bg-slate-100 text-slate-600 hover:bg-slate-200'

  return (
    <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* User Level Selector */}
        <div className="mb-3 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-slate-500" />
          <span className="text-xs text-slate-600 font-medium">레벨:</span>
          <div className="flex gap-1">
            {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setUserLevel(level)}
                disabled={disabled}
                className={`px-3 py-1 text-xs rounded-md transition-all
                  ${
                    userLevel === level
                      ? activeLevelStyles[level]
                      : inactiveStyles
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1`}
                title={levelDescriptions[level]}
              >
                {levelLabels[level]}
              </button>
            ))}
          </div>
          <span className="ml-2 text-xs text-slate-500">{levelDescriptions[userLevel]}</span>
        </div>

        {/* Input Area */}
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className="w-full resize-none px-4 py-3 border border-slate-200 rounded-lg
                       text-sm text-slate-900 placeholder:text-slate-400
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                       disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
                       transition-colors"
              style={{
                minHeight: '48px',
                maxHeight: '200px',
              }}
              onInput={(e) => {
                // Auto-resize textarea
                const target = e.target as HTMLTextAreaElement
                target.style.height = '48px'
                target.style.height = `${target.scrollHeight}px`
              }}
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="flex items-center justify-center w-12 h-12 bg-slate-900 text-white rounded-lg
                     hover:bg-slate-800 transition-colors
                     disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Helper Text */}
      <div className="max-w-4xl mx-auto mt-2 text-xs text-slate-500 text-center">
        <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600">
          Enter
        </kbd>
        {' '}전송 · {' '}
        <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600">
          Shift + Enter
        </kbd>
        {' '}줄바꿈
      </div>
    </form>
  )
}
