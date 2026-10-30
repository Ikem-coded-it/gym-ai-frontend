import { Sparkle } from '@phosphor-icons/react'
import { useState } from 'react'
import SelectableChip from '~/components/global/SelectableChip'
import { Button } from '~/components/ui/button'
import {
  FOCUS_AREAS,
  getTrainingDayLabel,
  type FocusArea,
  type TrainingDay,
} from '~/lib/interfaces/onboarding'
import { aiFocusSchema } from '~/lib/validators/onboarding'

type AiRoutinePanelProps = {
  day: TrainingDay
  selectedFocusAreas: FocusArea[]
  onToggleFocusArea: (area: FocusArea) => void
  onGenerate: () => void
  isGenerating?: boolean
}

export default function AiRoutinePanel({
  day,
  selectedFocusAreas,
  onToggleFocusArea,
  onGenerate,
  isGenerating = false,
}: AiRoutinePanelProps) {
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = () => {
    const result = aiFocusSchema.safeParse({
      focusAreas: selectedFocusAreas,
    })

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Invalid selection')
      return
    }

    setError(null)
    onGenerate()
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-card p-5 shadow-card ring-1 ring-foreground/5">
        <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
          <Sparkle weight="fill" className="size-5" />
        </span>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          What would you like to train on {getTrainingDayLabel(day)}?
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Select your focus areas and we&apos;ll craft an optimal routine.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FOCUS_AREAS.map((area) => (
          <SelectableChip
            key={area.value}
            label={area.label}
            value={area.value}
            selected={selectedFocusAreas.includes(area.value)}
            onSelect={(value) => {
              onToggleFocusArea(value)
              if (error) setError(null)
            }}
          />
        ))}
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating}
        size="lg"
        className="w-full"
      >
        <Sparkle weight="fill" className="size-4" />
        {isGenerating ? 'Generating...' : 'Generate Routine'}
      </Button>
    </div>
  )
}
