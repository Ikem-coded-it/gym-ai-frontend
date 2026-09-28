import type { IApiChatComposer } from '~/lib/interfaces/chat-composer'
import type { IChatHistoryResponse } from '~/lib/interfaces/chat'
import { mapApiComposer } from '~/lib/utils/chat-composer'
import ApiService from './api.service'
import type { ChatStreamEvent } from '~/lib/interfaces/chat'

export type ChatStreamHandlers = {
  onToken: (token: string) => void
  onComposer?: (payload: {
    messageId: string
    composer: ReturnType<typeof mapApiComposer>
  }) => void
  onComposerClear?: (payload: { messageId: string }) => void
  onDone?: (payload: { messageId: string }) => void
}

function parseSseEvents(buffer: string): {
  events: ChatStreamEvent[]
  rest: string
} {
  const parts = buffer.split('\n\n')
  const rest = parts.pop() ?? ''
  const events: ChatStreamEvent[] = []

  for (const part of parts) {
    const dataLine = part
      .split('\n')
      .find((line) => line.startsWith('data:'))
    if (!dataLine) continue

    const payload = dataLine.replace(/^data:\s*/, '').trim()
    if (!payload) continue

    events.push(JSON.parse(payload) as ChatStreamEvent)
  }

  return { events, rest }
}

class ChatService {
  async getHistory() {
    return ApiService.get<IChatHistoryResponse>('/chat/history')
  }

  async streamMessage(
    message: string,
    handlers: ChatStreamHandlers,
    signal?: AbortSignal
  ): Promise<void> {
    const response = await ApiService.postStream(
      '/chat',
      { message },
      { signal }
    )

    if (!response.body) {
      throw new Error('No response body')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const parsed = parseSseEvents(buffer)
        buffer = parsed.rest

        for (const event of parsed.events) {
          if (event.type === 'token' && event.content) {
            handlers.onToken(event.content)
          } else if (event.type === 'composer') {
            handlers.onComposer?.({
              messageId: event.message_id,
              composer: mapApiComposer(event.composer),
            })
          } else if (event.type === 'composer_clear') {
            handlers.onComposerClear?.({ messageId: event.message_id })
          } else if (event.type === 'error') {
            throw new Error(event.message || 'Chat stream failed')
          } else if (event.type === 'done') {
            if (event.message_id) {
              handlers.onDone?.({ messageId: event.message_id })
            }
            return
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }
}

const chatService = new ChatService()
export default chatService
