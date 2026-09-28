import type {
  IApiChatComposer,
  IChatComposer,
} from '~/lib/interfaces/chat-composer'
import type { IChatHistoryResponse, IChatMessage } from '~/lib/interfaces/chat'
import { mapApiMessagesToChatMessages } from '~/lib/utils/chat'

export function mapApiComposer(payload: IApiChatComposer): IChatComposer {
  return {
    kind: payload.kind,
    options: payload.options,
    suggestedValue: payload.suggested_value ?? null,
  }
}

/** Only the latest assistant message with a composer shows active shortcuts. */
export function shouldShowMessageComposer(
  message: IChatMessage,
  messages: IChatMessage[],
  isStreaming: boolean
): boolean {
  if (isStreaming || message.role !== 'ai' || !message.composer) {
    return false
  }

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const candidate = messages[index]
    if (candidate.role !== 'ai' || !candidate.composer) {
      continue
    }
    return candidate.id === message.id
  }

  return false
}

/** For backend integration: map API `active_composer` onto the last assistant message. */
export function attachActiveComposerToMessages(
  messages: IChatMessage[],
  activeComposer: IChatComposer | null | undefined
): IChatMessage[] {
  if (!activeComposer) {
    return messages
  }

  let lastAssistantIndex = -1
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index].role === 'ai') {
      lastAssistantIndex = index
      break
    }
  }

  if (lastAssistantIndex === -1) {
    return messages
  }

  return messages.map((message, index) =>
    index === lastAssistantIndex
      ? { ...message, composer: activeComposer }
      : message
  )
}

export function getActiveComposerFromHistory(
  history: IChatHistoryResponse
): IChatComposer | null {
  const raw =
    history.active_composer ??
    (history as { activeComposer?: IApiChatComposer }).activeComposer

  return raw ? mapApiComposer(raw) : null
}

export function mapChatHistoryToMessages(
  history: IChatHistoryResponse
): IChatMessage[] {
  const messages = mapApiMessagesToChatMessages(history.messages)
  const activeComposer = getActiveComposerFromHistory(history)

  return attachActiveComposerToMessages(messages, activeComposer)
}
