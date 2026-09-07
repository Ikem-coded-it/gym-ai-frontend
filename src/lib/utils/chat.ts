import type {
  ApiChatRole,
  IChatHistoryMessage,
  IChatMessage,
} from '~/lib/interfaces/chat'

export function mapApiMessageToChatMessage(
  message: IChatHistoryMessage
): IChatMessage {
  return {
    id: message.id,
    role: message.role === 'assistant' ? 'ai' : 'user',
    content: message.content,
  }
}

export function mapApiMessagesToChatMessages(
  messages: IChatHistoryMessage[]
): IChatMessage[] {
  return messages.map(mapApiMessageToChatMessage)
}
