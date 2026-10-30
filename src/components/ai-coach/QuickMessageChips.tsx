import ChatQuickReplyChip from '~/components/ai-coach/composer/ChatQuickReplyChip'
import { QUICK_MESSAGES } from '~/lib/constants/chat'

type QuickMessageChipsProps = {
  onSend: (message: string) => void
  disabled?: boolean
}

/**
 * Common messages the user can send with one tap. Pinned to the bottom-right of the
 * message area, just above the input bar (the user's side of the chat), and stacked
 * onto new lines when they don't fit side by side. Sending one adds it to the chat
 * after the last message; the chips themselves stay put.
 */
export default function QuickMessageChips({
  onSend,
  disabled = false,
}: QuickMessageChipsProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom)+4.25rem)] z-10 px-4">
      <div className="mx-auto flex max-w-md flex-wrap justify-end gap-2">
        {QUICK_MESSAGES.map((message) => (
          <ChatQuickReplyChip
            key={message}
            label={message}
            disabled={disabled}
            onClick={() => onSend(message)}
            className="pointer-events-auto h-auto whitespace-normal py-2 text-right shadow-card"
          />
        ))}
      </div>
    </div>
  )
}
