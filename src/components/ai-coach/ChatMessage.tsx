'use client'

import { Robot, User } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import ChatMessageComposer from '~/components/ai-coach/composer/ChatMessageComposer'
import ChatMarkdown from '~/components/ai-coach/ChatMarkdown'
import { Spinner } from '~/components/ui/spinner'
import type { IChatMessage } from '~/lib/interfaces/chat'
import useAuthStore from '~/store/zustand/auth.zustand'
import { cn } from '~/lib/utils'

type ChatMessageProps = {
  message: IChatMessage
  /** When true, render `message.composer` under the assistant bubble. */
  showComposer?: boolean
  /** Fired with the option value; parent should send it like typed chat input. */
  onComposerSelect?: (value: string) => void
  composerDisabled?: boolean
}

function AiAvatar() {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
      <Robot className="size-4 text-muted-foreground" weight="fill" />
    </div>
  )
}

function UserAvatar() {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
      <User className="size-4 text-blue-600" weight="fill" />
    </div>
  )
}

function ChatBubble({
  isAi,
  align,
  children,
}: {
  isAi: boolean
  align: 'start' | 'end'
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'max-w-[85%] w-fit',
        align === 'end' ? 'self-end' : 'self-start',
      )}
    >
      <div
        className={cn(
          'px-3 py-2.5 text-sm leading-relaxed',
          isAi
            ? 'rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-sm'
            : 'rounded-2xl bg-blue-600 text-white whitespace-pre-wrap',
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default function ChatMessage({
  message,
  showComposer = false,
  onComposerSelect,
  composerDisabled = false,
}: ChatMessageProps) {
  const isAi = message.role === 'ai'
  const firstName = useAuthStore((state) => state.currentUser?.firstName)
  const align = isAi ? 'start' : 'end'
  const canShowComposer =
    isAi &&
    showComposer &&
    message.composer &&
    onComposerSelect &&
    !message.isStreaming

  return (
    <div
      data-slot="message"
      data-align={align}
      className={cn('flex gap-2', isAi ? 'flex-row' : 'flex-row-reverse')}
    >
      {isAi ? <AiAvatar /> : <UserAvatar />}

      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col gap-2',
          !isAi && 'items-end',
        )}
      >
        <span
          className={cn(
            'px-0.5 text-xs text-muted-foreground',
            !isAi && 'w-full text-right',
          )}
        >
          {isAi ? 'GymAI' : firstName || 'User'}
        </span>

        {message.isStreaming && !message.content && (
          <ChatBubble isAi={isAi} align={align}>
            <Spinner className="size-4 text-muted-foreground" />
          </ChatBubble>
        )}

        {message.content && (
          <ChatBubble isAi={isAi} align={align}>
            {isAi ? (
              <ChatMarkdown content={message.content} />
            ) : (
              message.content
            )}
          </ChatBubble>
        )}

        {message.imageUrl && (
          <div
            className={cn(
              'max-w-[85%] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm',
              align === 'end' ? 'self-end' : 'self-start',
            )}
          >
            <img
              src={message.imageUrl}
              alt={message.imageAlt ?? 'Workout reference'}
              className="max-h-48 w-full object-cover"
            />
          </div>
        )}

        {canShowComposer && (
          <ChatMessageComposer
            composer={message.composer!}
            onSelect={onComposerSelect}
            disabled={composerDisabled}
          />
        )}
      </div>
    </div>
  )
}
