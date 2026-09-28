import type { IChatComposer } from '~/lib/interfaces/chat-composer'
import type { IChatMessage } from '~/lib/interfaces/chat'
import { FOCUS_AREAS, TRAINING_DAYS } from '~/lib/interfaces/onboarding'

export const MOCK_DAY_SELECT_COMPOSER: IChatComposer = {
  kind: 'day_select',
  options: TRAINING_DAYS.map((day) => ({
    label: day.label,
    value: day.value,
  })),
  suggestedValue: 'wednesday',
}

export const MOCK_MUSCLE_CHIPS_COMPOSER: IChatComposer = {
  kind: 'muscle_group_multi_select',
  options: FOCUS_AREAS.map((area) => ({
    label: area.label,
    value: area.value,
  })),
}

export const MOCK_SUGGEST_COMPOSER: IChatComposer = {
  kind: 'chips',
  options: [{ label: 'Suggest a plan', value: 'suggest' }],
}

export const MOCK_CONFIRM_COMPOSER: IChatComposer = {
  kind: 'confirm',
  options: [
    { label: 'Confirm', value: 'confirm' },
    { label: 'Edit', value: 'edit' },
  ],
}

/** Example thread for local UI review — not used in production chat yet. */
export const MOCK_SCHEDULING_MESSAGES: IChatMessage[] = [
  {
    id: 'mock-user-1',
    role: 'user',
    content: 'What am I training today?',
  },
  {
    id: 'mock-ai-1',
    role: 'ai',
    content:
      'You have a rest day today — no workout scheduled.\n\nWould you like to schedule a workout?',
  },
  {
    id: 'mock-user-2',
    role: 'user',
    content: 'yes',
  },
  {
    id: 'mock-ai-2',
    role: 'ai',
    content: 'Which day would you like to schedule this for?',
    composer: MOCK_DAY_SELECT_COMPOSER,
  },
]
