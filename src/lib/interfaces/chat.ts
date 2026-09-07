export type ChatRole = 'ai' | 'user'

export interface IChatMessage {
  id: string
  role: ChatRole
  content: string
  imageUrl?: string
  imageAlt?: string
  isStreaming?: boolean
}

export type ApiChatRole = 'user' | 'assistant'

export interface IChatHistoryMessage {
  id: string
  role: ApiChatRole
  content: string
  user_id: string
  conversation_id: string
  created_at: string
  updated_at: string
}

export interface IChatHistoryResponse {
  conversation_id: string
  messages: IChatHistoryMessage[]
}
