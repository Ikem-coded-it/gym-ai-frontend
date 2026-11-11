import { DotsSixVertical } from '@phosphor-icons/react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import WorkoutExerciseCard from '~/components/dashboard/WorkoutExerciseCard'
import { cn } from '~/lib/utils'

type SortableWorkoutExerciseCardProps = Omit<
  React.ComponentProps<typeof WorkoutExerciseCard>,
  'dragHandle'
> & {
  /** Show the drag handle. Hide it when there is nothing to reorder. */
  sortable?: boolean
}

/** A workout exercise card that can be dragged into a new place by its handle. */
export default function SortableWorkoutExerciseCard({
  sortable = true,
  ...cardProps
}: SortableWorkoutExerciseCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cardProps.exercise.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        'rounded-2xl',
        isDragging && 'relative z-10 opacity-90 shadow-float'
      )}
    >
      <WorkoutExerciseCard
        {...cardProps}
        dragHandle={
          sortable ? (
            <button
              type="button"
              ref={setActivatorNodeRef}
              {...attributes}
              {...listeners}
              className="flex size-9 shrink-0 cursor-grab touch-none items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/30 active:cursor-grabbing"
              aria-label={`Reorder ${cardProps.exercise.name}. Drag, or press space and use the arrow keys.`}
            >
              <DotsSixVertical weight="bold" className="size-5" />
            </button>
          ) : undefined
        }
      />
    </div>
  )
}
