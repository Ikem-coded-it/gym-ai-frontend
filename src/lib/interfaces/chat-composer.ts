/** Matches backend `ChatComposer` — shortcuts shown under an assistant message. */

export type ChatComposerKind =
  | 'day_select'
  | 'chips'
  | 'muscle_group_multi_select'
  | 'confirm'

export interface IComposerOption {
  label: string
  value: string
}

export interface IChatComposer {
  kind: ChatComposerKind
  options: IComposerOption[]
  suggestedValue?: string | null
}

/** JSON shape from the API / SSE (snake_case). */
export interface IApiChatComposer {
  kind: ChatComposerKind
  options: IComposerOption[]
  suggested_value?: string | null
}
