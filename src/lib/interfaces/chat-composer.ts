/** Matches backend `ChatComposer` — shortcuts shown under an assistant message. */

export type ChatComposerKind =
  | 'day_select'
  | 'chips'
  | 'muscle_group_multi_select'
  | 'exercise_form'
  | 'confirm'

export interface IComposerOption {
  label: string
  value: string
}

export interface IComposerExercise {
  exercise: string
  set_count: number
  rep_count: number
  kg_weight?: number | null
  equipment_name?: string | null
}

export interface IChatComposer {
  kind: ChatComposerKind
  options: IComposerOption[]
  suggestedValue?: string | null
  exercises?: IComposerExercise[] | null
}

/** JSON shape from the API / SSE (snake_case). */
export interface IApiChatComposer {
  kind: ChatComposerKind
  options: IComposerOption[]
  suggested_value?: string | null
  exercises?: IComposerExercise[] | null
}
