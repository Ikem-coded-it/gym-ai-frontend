import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import AiCoachHeader from '~/components/ai-coach/AiCoachHeader'
import ChatInputBar from '~/components/ai-coach/ChatInputBar'
import ChatMessage from '~/components/ai-coach/ChatMessage'
import { Spinner } from '~/components/ui/spinner'
import { chatQueryKeys } from '~/lib/constants/chat'
import type { IChatMessage } from '~/lib/interfaces/chat'
import { mapApiMessagesToChatMessages } from '~/lib/utils/chat'
import chatService from '~/services/chat.service'

export default function AiCoachChat() {
  const queryClient = useQueryClient()
  const [messages, setMessages] = useState<IChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const {
    data: history,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: chatQueryKeys.history,
    queryFn: () => chatService.getHistory(),
  })

  useEffect(() => {
    if (history) {
      setMessages(mapApiMessagesToChatMessages(history.messages))
    }
  }, [history])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: isStreaming ? 'auto' : 'smooth',
    })
  }, [messages, isStreaming])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  const handleSend = async (content: string) => {
    const assistantId = crypto.randomUUID()

    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: 'user',
        content,
      },
      {
        id: assistantId,
        role: 'ai',
        content: '',
        isStreaming: true,
      },
    ])
    setIsStreaming(true)

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      await chatService.streamMessage(
        content,
        (token) => {
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantId
                ? { ...message, content: message.content + token }
                : message
            )
          )
        },
        controller.signal
      )
      await queryClient.invalidateQueries({ queryKey: chatQueryKeys.history })
    } catch (error) {
      if (controller.signal.aborted) return

      toast.error(
        error instanceof Error ? error.message : 'Failed to get a response'
      )
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                content:
                  message.content ||
                  'Sorry, I could not answer that. Please try again.',
              }
            : message
        )
      )
    } finally {
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId
            ? { ...message, isStreaming: false }
            : message
        )
      )
      setIsStreaming(false)
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <AiCoachHeader />

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 pb-36">
        {isLoading && (
          <div className="flex justify-center py-8">
            <Spinner className="size-6 text-blue-600" />
          </div>
        )}

        {isError && (
          <p className="text-sm text-destructive" role="alert">
            {error instanceof Error ? error.message : 'Failed to load chat history'}
          </p>
        )}

        {!isLoading && !isError && messages.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">
            Ask GymAI anything about your workout, exercises, or progress.
          </p>
        )}

        {!isLoading &&
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        <div ref={bottomRef} />
      </div>

      <ChatInputBar onSend={handleSend} disabled={isStreaming || isLoading} />
    </div>
  )
}
