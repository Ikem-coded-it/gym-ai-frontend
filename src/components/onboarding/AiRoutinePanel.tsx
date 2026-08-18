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
}

export default function AiRoutinePanel({
  day,
  selectedFocusAreas,
  onToggleFocusArea,
  onGenerate,
}: AiRoutinePanelProps) {
  const [error, setError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    const result = aiFocusSchema.safeParse({
      focusAreas: selectedFocusAreas,
    })

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Invalid selection')
      return
    }

    setError(null)
    setIsGenerating(true)

    await new Promise((resolve) => setTimeout(resolve, 800))

    onGenerate()
    setIsGenerating(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-medium text-gray-900">
          What would you like to train on {getTrainingDayLabel(day)}?
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Select your focus areas and we&apos;ll craft an optimal routine.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
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
        className="h-12 w-full rounded-lg bg-blue-600 text-base text-white hover:bg-blue-700"
      >
        <Sparkle weight="fill" className="size-4" />
        {isGenerating ? 'Generating...' : 'Generate Routine'}
      </Button>
    </div>
  )
}
