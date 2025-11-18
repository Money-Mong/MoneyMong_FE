// ===================================
// User & Auth Types
// ===================================

export interface User {
  id: string
  email: string
  username: string
  profile_image_url?: string
  oauth_provider: 'google' | 'naver' | 'kakao'
  is_active: boolean
  created_at: string
  updated_at: string
  last_login_at?: string
}

export interface UserProfile {
  id: string
  user_id: string
  finance_level: 'beginner' | 'intermediate' | 'advanced'
  interests: string[]
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  access_token: string
  refresh_token?: string
  token_type: 'bearer'
  user: User
}

// ===================================
// Document & Report Types
// ===================================

export interface Document {
  id: string
  source_type: 'pdf' | 'url' | 'text'
  source_url: string
  title: string
  author?: string
  published_date?: string
  file_path?: string
  file_size?: number
  total_pages?: number
  language: string
  metadata?: Record<string, unknown>
  processing_status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
  updated_at: string
}

export interface DocumentSummary {
  id: string
  document_id: string
  summary_short: string  // 200자 이내
  summary_long: string   // 1000자 이내
  key_points: string[]
  entities?: Record<string, unknown>  // NER 추출 엔티티
  model_version: string
  created_at: string
  updated_at: string
}

export interface DocumentWithSummary extends Document {
  summary?: DocumentSummary
}

// ===================================
// Conversation & Chat Types
// ===================================

export interface Conversation {
  id: string
  user_id: string
  title?: string
  session_type: 'general' | 'report_based'
  primary_document_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  cited_chunks?: string[]  // 참조된 청크 ID
  follow_up_questions?: string[]  // 후속 질문 제안 (3개)
  reference_context?: Record<string, unknown>
  model_version?: string
  token_usage?: {
    prompt: number
    completion: number
    total: number
  }
  latency_ms?: number
  created_at: string
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[]
}

// ===================================
// API Request/Response Types
// ===================================

export interface GoogleOAuthCallbackRequest {
  code: string
  redirect_uri?: string
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface CreateConversationRequest {
  session_type: 'general' | 'report_based'
  primary_document_id?: string
  title?: string
}

export interface SendMessageRequest {
  content: string  // conversation_id는 URL 파라미터로 전달
}

// ===================================
// API Response Types (Backend 페이지네이션 구조)
// ===================================

export interface PaginatedResponse<T> {
  total: number
  items: T[]
}

export type DocumentListResponse = PaginatedResponse<Document>
export type ConversationListResponse = PaginatedResponse<Conversation>
export type MessageListResponse = PaginatedResponse<Message>

// ===================================
// UI State Types
// ===================================

export interface SidebarState {
  isOpen: boolean
  selectedConversationId?: string
}

export interface ChatInputState {
  message: string
  isStreaming: boolean
}

// ===================================
// Mock Data Types (임시)
// ===================================

export interface MockDocument extends Document {
  importance?: 'high' | 'medium' | 'low'  // 갤러리 크기 결정용
}
