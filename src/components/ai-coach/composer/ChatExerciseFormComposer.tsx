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
  createEmptySetRow,
  formatExercisesMessage,
  parseKgWeightInput,
  parseRepsInput,
  type ExerciseDraftRow,
  type SetDraftRow,
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

  const updateRow = (index: number, patch: Partial<ExerciseDraftRow>) => {
    setRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, ...patch } : row
      )
    )
  }

  const updateSet = (
    rowIndex: number,
    setIndex: number,
    patch: Partial<SetDraftRow>
  ) => {
    setRows((current) =>
      current.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              sets: row.sets.map((set, i) =>
                i === setIndex ? { ...set, ...patch } : set
              ),
            }
          : row
      )
    )
  }

  const addSet = (rowIndex: number) => {
    setRows((current) =>
      current.map((row, index) => {
        if (index !== rowIndex) return row
        // New set starts from the previous one, the usual starting point for the next set.
        const last = row.sets[row.sets.length - 1]
        return {
          ...row,
          sets: [...row.sets, last ? { ...last } : createEmptySetRow()],
        }
      })
    )
  }

  const removeSet = (rowIndex: number, setIndex: number) => {
    setRows((current) =>
      current.map((row, index) =>
        index === rowIndex && row.sets.length > 1
          ? { ...row, sets: row.sets.filter((_, i) => i !== setIndex) }
          : row
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

          <div className="grid grid-cols-2 gap-2.5">
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

          <div className="space-y-2">
            {row.sets.map((set, setIndex) => (
              <div
                key={`exercise-${index}-set-${setIndex}`}
                className="space-y-2 rounded-xl bg-muted/60 p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary">
                    Set {setIndex + 1}
                  </span>
                  {row.sets.length > 1 && (
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => removeSet(index, setIndex)}
                      className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Remove set ${setIndex + 1} of exercise ${index + 1}`}
                    >
                      <Trash className="size-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={`exercise-${index}-set-${setIndex}-reps`}
                      className="text-xs text-muted-foreground"
                    >
                      Reps
                    </Label>
                    <Input
                      id={`exercise-${index}-set-${setIndex}-reps`}
                      type="number"
                      min={1}
                      disabled={disabled}
                      value={set.rep_count ?? ''}
                      onChange={(event) =>
                        updateSet(index, setIndex, {
                          rep_count: parseRepsInput(event.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={`exercise-${index}-set-${setIndex}-kg`}
                      className="text-xs text-muted-foreground"
                    >
                      Weight (kg)
                    </Label>
                    <Input
                      id={`exercise-${index}-set-${setIndex}-kg`}
                      type="number"
                      min={0}
                      disabled={disabled}
                      placeholder="Bodyweight"
                      value={set.kg_weight ?? ''}
                      onChange={(event) =>
                        updateSet(index, setIndex, {
                          kg_weight: parseKgWeightInput(event.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <Input
                  value={set.notes}
                  disabled={disabled}
                  placeholder="Notes (optional)"
                  aria-label={`Notes for set ${setIndex + 1} of exercise ${index + 1}`}
                  onChange={(event) =>
                    updateSet(index, setIndex, { notes: event.target.value })
                  }
                />
              </div>
            ))}

            <button
              type="button"
              disabled={disabled}
              onClick={() => addSet(index)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-primary/25 py-2 text-sm font-medium text-primary transition-colors hover:bg-secondary/60"
            >
              <Plus weight="bold" className="size-3.5" />
              Add set
            </button>
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
