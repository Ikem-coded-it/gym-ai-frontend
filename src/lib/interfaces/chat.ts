import type {
  IApiChatComposer,
  IChatComposer,
} from '~/lib/interfaces/chat-composer'

export type ChatRole = 'ai' | 'user'

export interface IChatMessage {
  id: string
  role: ChatRole
  content: string
  imageUrl?: string
  imageAlt?: string
  isStreaming?: boolean
  /** Scheduling shortcuts from SSE `composer` (under this bubble when active). */
  composer?: IChatComposer
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
  active_composer?: IApiChatComposer | null
}

export type ChatStreamEvent =
  | { type: 'start'; conversation_id?: string }
  | { type: 'token'; content?: string }
  | {
      type: 'composer'
      message_id: string
      composer: IApiChatComposer
    }
  | { type: 'composer_clear'; message_id: string }
  | { type: 'done'; message_id?: string }
  | { type: 'error'; message?: string }

export type ChatStreamHandlers = {
  onToken: (token: string) => void
  onComposer?: (payload: {
    messageId: string
    composer: ReturnType<typeof mapApiComposer>
  }) => void
  onComposerClear?: (payload: { messageId: string }) => void
  onDone?: (payload: { messageId: string }) => void
}