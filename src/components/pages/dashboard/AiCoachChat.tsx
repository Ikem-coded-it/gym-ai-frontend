'use client'

import { ChatCircleDots } from '@phosphor-icons/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import AiCoachHeader from '~/components/ai-coach/AiCoachHeader'
import ChatInputBar from '~/components/ai-coach/ChatInputBar'
import ChatMessage from '~/components/ai-coach/ChatMessage'
import QuickMessageChips from '~/components/ai-coach/QuickMessageChips'
import EmptyState from '~/components/global/EmptyState'
import { Spinner } from '~/components/ui/spinner'
import { chatQueryKeys } from '~/lib/constants/chat'
import { workoutQueryKeys } from '~/lib/constants/workout'
import type { IChatMessage } from '~/lib/interfaces/chat'
import {
  mapChatHistoryToMessages,
  shouldShowMessageComposer,
} from '~/lib/utils/chat-composer'
import chatService from '~/services/chat.service'

function patchAssistantMessage(
  messages: IChatMessage[],
  assistantLocalId: string,
  assistantActiveId: string,
  patch: Partial<IChatMessage>
): IChatMessage[] {
  return messages.map((message) => {
    const isTarget =
      message.id === assistantActiveId || message.id === assistantLocalId
    if (!isTarget || message.role !== 'ai') {
      return message
    }
    return { ...message, ...patch }
  })
}

export default function AiCoachChat() {
  const queryClient = useQueryClient()
  const [messages, setMessages] = useState<IChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const hasInitialScrollRef = useRef(false)
  const abortRef = useRef<AbortController | null>(null)
  const assistantLocalIdRef = useRef<string>('')
  const assistantActiveIdRef = useRef<string>('')

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
    if (history && !isStreaming) {
      setMessages(mapChatHistoryToMessages(history))
    }
  }, [history, isStreaming])

  useEffect(() => {
    if (messages.length === 0) return
    // Jump straight to the latest message on first load; animate only afterwards.
    const behavior = !hasInitialScrollRef.current
      ? 'instant'
      : isStreaming
        ? 'auto'
        : 'smooth'
    hasInitialScrollRef.current = true
    bottomRef.current?.scrollIntoView({ behavior })
  }, [messages, isStreaming])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  const handleSend = async (content: string) => {
    const assistantLocalId = crypto.randomUUID()
    assistantLocalIdRef.current = assistantLocalId
    assistantActiveIdRef.current = assistantLocalId

    setMessages((current) => [
      ...current.map((message) =>
        message.composer ? { ...message, composer: undefined } : message
      ),
      {
        id: crypto.randomUUID(),
        role: 'user',
        content,
      },
      {
        id: assistantLocalId,
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
        {
          onToken: (token) => {
            setMessages((current) =>
              current.map((message) => {
                const isStreamingAssistant =
                  message.role === 'ai' &&
                  (message.id === assistantActiveIdRef.current ||
                    message.id === assistantLocalIdRef.current)
                if (!isStreamingAssistant) {
                  return message
                }
                return { ...message, content: message.content + token }
              })
            )
          },
          onComposer: ({ messageId, composer }) => {
            assistantActiveIdRef.current = messageId
            setMessages((current) =>
              patchAssistantMessage(
                current,
                assistantLocalIdRef.current,
                assistantActiveIdRef.current,
                { id: messageId, composer }
              )
            )
          },
          onComposerClear: ({ messageId }) => {
            assistantActiveIdRef.current = messageId
            setMessages((current) =>
              patchAssistantMessage(
                current,
                assistantLocalIdRef.current,
                assistantActiveIdRef.current,
                { id: messageId, composer: undefined }
              )
            )
          },
          onDone: ({ messageId }) => {
            assistantActiveIdRef.current = messageId
            setMessages((current) =>
              patchAssistantMessage(
                current,
                assistantLocalIdRef.current,
                assistantActiveIdRef.current,
                { id: messageId }
              )
            )
          },
        },
        controller.signal
      )

      await queryClient.invalidateQueries({ queryKey: chatQueryKeys.history })
      await queryClient.invalidateQueries({ queryKey: workoutQueryKeys.all })
    } catch (error) {
      if (controller.signal.aborted) return

      toast.error(
        error instanceof Error ? error.message : 'Failed to get a response'
      )
      setMessages((current) =>
        patchAssistantMessage(
          current,
          assistantLocalIdRef.current,
          assistantActiveIdRef.current,
          {
            content:
              current.find(
                (message) =>
                  message.id === assistantActiveIdRef.current ||
                  message.id === assistantLocalIdRef.current
              )?.content ||
              'Sorry, I could not answer that. Please try again.',
          }
        )
      )
    } finally {
      setMessages((current) =>
        patchAssistantMessage(
          current,
          assistantLocalIdRef.current,
          assistantActiveIdRef.current,
          { isStreaming: false }
        )
      )
      setIsStreaming(false)
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <AiCoachHeader />

      <div className="mx-auto w-full max-w-md flex-1 space-y-5 overflow-y-auto px-4 py-5 pb-60">
        {isLoading && (
          <div className="flex justify-center py-8">
            <Spinner className="size-6 text-primary" />
          </div>
        )}

        {isError && (
          <p
            className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {error instanceof Error ? error.message : 'Failed to load chat history'}
          </p>
        )}

        {!isLoading && !isError && messages.length === 0 && (
          <EmptyState
            icon={ChatCircleDots}
            title="Ask GymAI anything about your workout, exercises, or progress."
            className="mt-6"
          />
        )}

        {!isLoading &&
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              showComposer={shouldShowMessageComposer(
                message,
                messages,
                isStreaming
              )}
              onComposerSelect={handleSend}
              composerDisabled={isStreaming || isLoading}
            />
          ))}
        {!isLoading && !isError && (
          <QuickMessageChips
            onSend={handleSend}
            disabled={isStreaming}
          />
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInputBar onSend={handleSend} disabled={isStreaming || isLoading} />
    </div>
  )
}
