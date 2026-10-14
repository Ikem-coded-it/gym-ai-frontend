import * as React from 'react'

type AuthDividerProps = {
  children: React.ReactNode
}

export default function AuthDivider({ children }: AuthDividerProps) {
  return (
    <div className="my-6 flex items-center gap-3" role="separator">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs font-medium text-muted-foreground">
        {children}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}
