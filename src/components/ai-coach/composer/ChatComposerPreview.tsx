'use client'

import { useState } from 'react'
import ChatMessage from '~/components/ai-coach/ChatMessage'
import {
  MOCK_CONFIRM_COMPOSER,
  MOCK_MUSCLE_CHIPS_COMPOSER,
  MOCK_SCHEDULING_MESSAGES,
  MOCK_SUGGEST_COMPOSER,
} from '~/components/ai-coach/composer/chat-composer.mock'
import type { IChatMessage } from '~/lib/interfaces/chat'
import { shouldShowMessageComposer } from '~/lib/utils/chat-composer'

/**
 * Local-only preview of all composer kinds under assistant bubbles.
 * Import this on a dev route or temporarily render it to verify styling.
 */
export default function ChatComposerPreview() {
  const [messages, setMessages] = useState<IChatMessage[]>([
    ...MOCK_SCHEDULING_MESSAGES,
    {
      id: 'mock-ai-muscle',
      role: 'ai',
      content: 'What are you training that day?',
      composer: MOCK_MUSCLE_CHIPS_COMPOSER,
    },
    {
      id: 'mock-ai-exercises',
      role: 'ai',
      content:
        'Send your exercises one per line, or reply **suggest** and I\'ll propose a plan.',
      composer: MOCK_SUGGEST_COMPOSER,
    },
    {
      id: 'mock-ai-review',
      role: 'ai',
      content:
        '**Wednesday — Push**\n\n• Bench Press: 3×10 @ 60kg (barbell)\n\nReply **confirm** to save, or tell me what to change.',
      composer: MOCK_CONFIRM_COMPOSER,
    },
  ])
  const [isStreaming] = useState(false)

  const handleComposerSelect = (value: string) => {
    setMessages((current) => [
      ...current.map((message) => ({ ...message, composer: undefined })),
      {
        id: crypto.randomUUID(),
        role: 'user',
        content: value,
      },
    ])
  }

  return (
    <div className="mx-auto max-w-md space-y-4 px-4 py-6">
      <p className="text-center text-xs text-gray-500">
        Composer preview — selections append a user message (no API).
      </p>
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          showComposer={shouldShowMessageComposer(
            message,
            messages,
            isStreaming
          )}
          onComposerSelect={handleComposerSelect}
        />
      ))}
    </div>
  )
}
