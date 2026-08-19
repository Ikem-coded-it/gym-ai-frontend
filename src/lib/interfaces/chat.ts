export type ChatRole = 'ai' | 'user'

export interface IChatMessage {
  id: string
  role: ChatRole
  content: string
  imageUrl?: string
  imageAlt?: string
}
