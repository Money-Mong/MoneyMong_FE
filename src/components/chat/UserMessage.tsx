/**
 * UserMessage - 사용자 메시지 컴포넌트
 *
 * ChatGPT 스타일 적용:
 * - 간결한 말풍선
 * - 오른쪽 정렬
 */

import type { Message } from '@/types'

interface UserMessageProps {
  message: Message
}

export const UserMessage = ({ message }: UserMessageProps) => {
  return (
    <div className="py-6 px-4 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="whitespace-pre-wrap text-slate-900 leading-relaxed">
          {message.content}
        </div>
      </div>
    </div>
  )
}
