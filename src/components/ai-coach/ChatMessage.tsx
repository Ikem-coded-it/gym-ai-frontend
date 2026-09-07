import { Robot, User } from '@phosphor-icons/react'
import ChatMarkdown from '~/components/ai-coach/ChatMarkdown'
import type { IChatMessage } from '~/lib/interfaces/chat'
import useAuthStore from '~/store/zustand/auth.zustand'
import { Spinner } from '~/components/ui/spinner'
import { cn } from '~/lib/utils'

type ChatMessageProps = {
  message: IChatMessage
}

function AiAvatar() {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-slate-300 via-slate-100 to-slate-400 shadow-inner">
      <Robot className="size-4 text-slate-600" weight="fill" />
    </div>
  )
}

function UserAvatar() {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-200">
      <User className="size-4 text-gray-700" weight="fill" />
    </div>
  )
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAi = message.role === 'ai'
  const firstName = useAuthStore((state) => state.currentUser?.firstName)

  return (
    <div
      className={cn(
        'flex gap-2',
        isAi ? 'flex-row' : 'flex-row-reverse'
      )}
    >
      {isAi ? <AiAvatar /> : <UserAvatar />}

      <div
        className={cn(
          'flex max-w-[80%] flex-col gap-1',
          isAi ? 'items-start' : 'items-end'
        )}
      >
        <span className="px-1 text-xs text-gray-400">
          {isAi ? 'GymAI' : firstName || 'User'}
        </span>

        {message.isStreaming && !message.content && (
          <div className="rounded-2xl rounded-tl-sm bg-gray-200 px-4 py-3">
            <Spinner className="size-4 text-gray-500" />
          </div>
        )}

        {message.content && (
          <div
            className={cn(
              'rounded-2xl px-4 py-3 text-sm leading-relaxed',
              isAi
                ? 'rounded-tl-sm bg-gray-200 text-gray-800'
                : 'rounded-tr-sm bg-blue-600 text-white whitespace-pre-wrap'
            )}
          >
            {isAi ? (
              <ChatMarkdown content={message.content} />
            ) : (
              message.content
            )}
          </div>
        )}

        {message.imageUrl && (
          <div className="overflow-hidden rounded-2xl">
            <img
              src={message.imageUrl}
              alt={message.imageAlt ?? 'Workout reference'}
              className="max-h-48 w-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  )
}
