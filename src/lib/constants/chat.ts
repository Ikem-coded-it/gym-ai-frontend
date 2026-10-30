export const chatQueryKeys = {
  history: ['chat', 'history'] as const,
}

/** Common messages shown above the chat input; tapping one sends it as-is. */
export const QUICK_MESSAGES = [
  'I want to schedule a workout',
  'What do I have today?',
] as const
