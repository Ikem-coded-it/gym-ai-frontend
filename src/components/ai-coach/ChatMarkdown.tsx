import { type ReactNode } from 'react'
import { cn } from '~/lib/utils'

type ChatMarkdownProps = {
  content: string
  className?: string
}

type Block =
  | { type: 'heading'; level: number; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'p'; text: string }

const HEADING_CLASS: Record<number, string> = {
  1: 'text-base font-semibold',
  2: 'text-sm font-semibold',
  3: 'text-sm font-semibold',
  4: 'text-sm font-semibold',
  5: 'text-sm font-semibold',
  6: 'text-sm font-semibold',
}

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const blocks: Block[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) {
      i += 1
      continue
    }

    const heading = /^\s*(#{1,6})\s+(.*)$/.exec(line)
    if (heading) {
      blocks.push({
        type: 'heading',
        level: heading[1].length,
        text: heading[2],
      })
      i += 1
      continue
    }

    const unordered = /^\s*[-*]\s+(.*)$/.exec(line)
    if (unordered) {
      const items = [unordered[1]]
      i += 1
      while (i < lines.length) {
        const next = /^\s*[-*]\s+(.*)$/.exec(lines[i])
        if (!next) break
        items.push(next[1])
        i += 1
      }
      blocks.push({ type: 'ul', items })
      continue
    }

    const ordered = /^\s*\d+\.\s+(.*)$/.exec(line)
    if (ordered) {
      const items = [ordered[1]]
      i += 1
      while (i < lines.length) {
        const next = /^\s*\d+\.\s+(.*)$/.exec(lines[i])
        if (!next) break
        items.push(next[1])
        i += 1
      }
      blocks.push({ type: 'ol', items })
      continue
    }

    const paragraph = [line]
    i += 1
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^\s*(#{1,6}\s|[-*]\s|\d+\.\s)/.test(lines[i])
    ) {
      paragraph.push(lines[i])
      i += 1
    }
    blocks.push({ type: 'p', text: paragraph.join('\n') })
  }

  return blocks
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const pattern = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    if (match[1] !== undefined) {
      nodes.push(
        <code
          key={key}
          className="rounded bg-black/10 px-1 py-0.5 text-[0.85em]"
        >
          {match[1]}
        </code>
      )
    } else if (match[2] !== undefined) {
      nodes.push(<strong key={key}>{match[2]}</strong>)
    } else if (match[3] !== undefined) {
      nodes.push(<em key={key}>{match[3]}</em>)
    }

    key += 1
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

function Heading({ level, text }: { level: number; text: string }) {
  const className = cn(
    'mt-3 mb-1 font-mono first:mt-0',
    HEADING_CLASS[level]
  )
  const style = { fontFamily: 'inherit' as const }

  switch (level) {
    case 1:
      return (
        <h1 className={className} style={style}>
          {renderInline(text)}
        </h1>
      )
    case 2:
      return (
        <h2 className={className} style={style}>
          {renderInline(text)}
        </h2>
      )
    case 3:
      return (
        <h3 className={className} style={style}>
          {renderInline(text)}
        </h3>
      )
    case 4:
      return (
        <h4 className={className} style={style}>
          {renderInline(text)}
        </h4>
      )
    case 5:
      return (
        <h5 className={className} style={style}>
          {renderInline(text)}
        </h5>
      )
    default:
      return (
        <h6 className={className} style={style}>
          {renderInline(text)}
        </h6>
      )
  }
}

export default function ChatMarkdown({ content, className }: ChatMarkdownProps) {
  const blocks = parseBlocks(content)

  return (
    <div className={cn('text-sm leading-relaxed', className)}>
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          return <Heading key={index} level={block.level} text={block.text} />
        }

        if (block.type === 'ul') {
          return (
            <ul key={index} className="my-1.5 list-disc space-y-1 pl-4">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInline(item)}</li>
              ))}
            </ul>
          )
        }

        if (block.type === 'ol') {
          return (
            <ol key={index} className="my-1.5 list-decimal space-y-1 pl-4">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInline(item)}</li>
              ))}
            </ol>
          )
        }

        return (
          <p key={index} className="my-1.5 whitespace-pre-wrap first:mt-0 last:mb-0">
            {renderInline(block.text)}
          </p>
        )
      })}
    </div>
  )
}
