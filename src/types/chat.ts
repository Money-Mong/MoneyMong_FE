/**
 * Chat 관련 타입 정의
 */

export type UserLevel = 'beginner' | 'intermediate' | 'advanced'

export const USER_LEVEL_LABELS = {
  beginner: '해설',
  intermediate: '요약',
  advanced: '전문',
} as const

export const USER_LEVEL_DESCRIPTIONS = {
  beginner: '쉽게 설명해주세요',
  intermediate: '핵심만 요약해주세요',
  advanced: '전문적으로 분석해주세요',
} as const
