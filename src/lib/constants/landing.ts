import {
  ChatCircleDots,
  DeviceMobile,
  ListNumbers,
  PencilSimpleLine,
  Sparkle,
  Timer,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'

export const COACH_HIGHLIGHTS = [
  'Tap-to-pick options for the day, the muscle groups and confirming your plan',
  'Ask for a suggested plan and get at least two exercises for every muscle group, drawn from our exercise knowledge base',
  'Review and edit everything before a single exercise is saved',
] as const

export type LandingFeature = {
  title: string
  description: string
  icon: Icon
}

export const LANDING_FEATURES: LandingFeature[] = [
  {
    title: 'Every set on its own',
    description:
      'Log reps and weight for each set separately, so you can see exactly where you pushed harder or backed off.',
    icon: ListNumbers,
  },
  {
    title: 'Holds get a clock',
    description:
      'Planks, wall sits and dead hangs are tracked by time, not by a made-up rep count.',
    icon: Timer,
  },
  {
    title: 'Routines in one tap',
    description:
      'Pick the muscles you want to train and GymAI builds a routine for you to review, tweak and keep.',
    icon: Sparkle,
  },
  {
    title: 'Fix things by chatting',
    description:
      'Say "change bench to 4 sets" or "add lateral raises to Friday" and your saved workout updates.',
    icon: PencilSimpleLine,
  },
  {
    title: 'Ask anything',
    description:
      'Not sure how to do an exercise, or what is on today? Ask. Answers come from the exercise guides in our knowledge base.',
    icon: ChatCircleDots,
  },
  {
    title: 'Lives on your home screen',
    description:
      'Install GymAI from your browser and open it like any other app, with nothing to download from a store.',
    icon: DeviceMobile,
  },
]

export const LANDING_STEPS = [
  {
    title: 'Pick your training days',
    description: 'Choose which days of the week you train.',
  },
  {
    title: 'Build your routine',
    description:
      'Add exercises yourself, or let GymAI generate a routine for the muscles you choose.',
  },
  {
    title: 'Train and log',
    description:
      'Log each set, drag exercises into the order you will do them, and ask the coach when plans change.',
  },
] as const
