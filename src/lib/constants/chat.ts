import type { IChatMessage } from '~/lib/interfaces/chat'

export const DEMO_AI_COACH_MESSAGES: IChatMessage[] = [
  {
    id: '1',
    role: 'ai',
    content: "Let's hit those PRs today. What are you starting with?",
  },
  {
    id: '2',
    role: 'ai',
    content: '',
    imageUrl:
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Person performing bench press in a gym',
  },
  {
    id: '3',
    role: 'user',
    content: 'Hit 225 for 3x5 on bench',
  },
]
