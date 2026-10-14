'use client'

import { Plus, Trash } from '@phosphor-icons/react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import type {
  IComposerExercise,
  IComposerOption,
} from '~/lib/interfaces/chat-composer'
import {
  areAllExerciseRowsComplete,
  composerExercisesToRows,
  createEmptyExerciseRow,
  formatExercisesMessage,
  parseKgWeightInput,
  type ExerciseDraftRow,
} from '~/lib/utils/exercise-composer'
import { cn } from '~/lib/utils'

type ChatExerciseFormComposerProps = {
  suggestOption?: IComposerOption
  initialExercises?: IComposerExercise[] | null
  onSelect: (value: string) => void
  disabled?: boolean
  className?: string
}

export default function ChatExerciseFormComposer({
  suggestOption,
  initialExercises,
  onSelect,
  disabled = false,
  className,
}: ChatExerciseFormComposerProps) {
  const isPrefill = Boolean(initialExercises?.length)
  const [rows, setRows] = useState<ExerciseDraftRow[]>(() =>
    composerExercisesToRows(initialExercises)
  )

  const updateRow = (
    index: number,
    patch: Partial<ExerciseDraftRow>
  ) => {
    setRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, ...patch } : row
      )
    )
  }

  const addRow = () => {
    setRows((current) => [...current, createEmptyExerciseRow()])
  }

  const removeRow = (index: number) => {
    setRows((current) =>
      current.length <= 1 ? current : current.filter((_, i) => i !== index)
    )
  }

  const handleSend = () => {
    if (!areAllExerciseRowsComplete(rows)) return
    onSelect(formatExercisesMessage(rows))
  }

  const handleSuggest = () => {
    onSelect(suggestOption?.value ?? 'suggest')
  }

  const canSend = areAllExerciseRowsComplete(rows)

  return (
    <div className={cn('space-y-3', className)}>
      {rows.map((row, index) => (
        <div
          key={`exercise-row-${index}`}
          className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-card"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-primary">
              Exercise {index + 1}
            </span>
            {rows.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                disabled={disabled}
                onClick={() => removeRow(index)}
                aria-label={`Remove exercise ${index + 1}`}
              >
                <Trash className="size-3.5" />
              </Button>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`exercise-name-${index}`} className="text-xs text-muted-foreground">
              Name
            </Label>
            <Input
              id={`exercise-name-${index}`}
              value={row.exercise}
              disabled={disabled}
              placeholder="Bench Press"
              onChange={(event) =>
                updateRow(index, { exercise: event.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="space-y-1.5">
              <Label htmlFor={`exercise-sets-${index}`} className="text-xs text-muted-foreground">
                Sets
              </Label>
              <Input
                id={`exercise-sets-${index}`}
                type="number"
                min={1}
                disabled={disabled}
                value={row.set_count}
                onChange={(event) =>
                  updateRow(index, {
                    set_count: Number(event.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`exercise-reps-${index}`} className="text-xs text-muted-foreground">
                Reps
              </Label>
              <Input
                id={`exercise-reps-${index}`}
                type="number"
                min={1}
                disabled={disabled}
                value={row.rep_count}
                onChange={(event) =>
                  updateRow(index, {
                    rep_count: Number(event.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`exercise-kg-${index}`} className="text-xs text-muted-foreground">
                Weight (kg)
              </Label>
              <Input
                id={`exercise-kg-${index}`}
                type="number"
                min={0}
                disabled={disabled}
                placeholder="Bodyweight"
                value={row.kg_weight ?? ''}
                onChange={(event) =>
                  updateRow(index, {
                    kg_weight: parseKgWeightInput(event.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`exercise-equipment-${index}`} className="text-xs text-muted-foreground">
              Equipment
            </Label>
            <Input
              id={`exercise-equipment-${index}`}
              value={row.equipment_name}
              disabled={disabled}
              placeholder="barbell"
              onChange={(event) =>
                updateRow(index, { equipment_name: event.target.value })
              }
            />
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={addRow}
          className="rounded-full border-primary/25 bg-card px-4 text-primary shadow-none hover:border-primary/40 hover:bg-secondary"
        >
          <Plus className="size-3.5" weight="bold" />
          Add exercise
        </Button>

        {suggestOption && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={handleSuggest}
            className="rounded-full border-primary/25 bg-card px-4 text-primary shadow-none hover:border-primary/40 hover:bg-secondary"
          >
            {suggestOption.label}
          </Button>
        )}

        <Button
          type="button"
          size="sm"
          disabled={disabled || !canSend}
          onClick={handleSend}
          className="rounded-full px-4"
        >
          {isPrefill ? 'Update exercises' : 'Send exercises'}
        </Button>
      </div>
    </div>
  )
}
