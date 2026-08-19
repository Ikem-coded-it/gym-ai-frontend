import { useState } from 'react'
import AiCoachHeader from '~/components/ai-coach/AiCoachHeader'
import ChatInputBar from '~/components/ai-coach/ChatInputBar'
import ChatMessage from '~/components/ai-coach/ChatMessage'
import { DEMO_AI_COACH_MESSAGES } from '~/lib/constants/chat'
import type { IChatMessage } from '~/lib/interfaces/chat'

export default function AiCoachChat() {
  const [messages, setMessages] = useState<IChatMessage[]>(
    DEMO_AI_COACH_MESSAGES
  )

  const handleSend = (content: string) => {
    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: 'user',
        content,
      },
    ])
  }

  return (
    <div className="flex min-h-full flex-col">
      <AiCoachHeader />

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 pb-36">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      <ChatInputBar onSend={handleSend} />
    </div>
  )
}
