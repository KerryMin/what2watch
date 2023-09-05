import { ListItem } from '../CardList'

export type State = {
  step: number
  mediaType: ListItem[]
  genre: ListItem[]
  aiPrompt: string
}

export type Action =
  | {
      type: 'ADD_MEDIA_TYPE'
      payload: ListItem
    }
  | { type: 'REMOVE_MEDIA_TYPE'; payload: { id: string } }
  | { type: 'ADD_GENRE'; payload: ListItem }
  | { type: 'REMOVE_GENRE'; payload: { id: string } }
  | { type: 'CHANGE_STEP'; payload: number }
  | { type: 'CHANGE_AI_PROMPT'; payload: string }

export const initialState: State = {
  step: 0,
  mediaType: [],
  genre: [],
  aiPrompt: ''
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'CHANGE_AI_PROMPT':
      return {
        ...state,
        aiPrompt: action.payload
      }
    case 'CHANGE_STEP':
      return {
        ...state,
        step: action.payload
      }
    case 'ADD_MEDIA_TYPE':
      return {
        ...state,
        mediaType: [...state.mediaType, action.payload]
      }
    case 'REMOVE_MEDIA_TYPE':
      return {
        ...state,
        mediaType: state.mediaType.filter(
          (media) => media.id !== action.payload.id
        )
      }
    case 'ADD_GENRE':
      return {
        ...state,
        genre: [...state.genre, action.payload]
      }
    case 'REMOVE_GENRE':
      return {
        ...state,
        genre: state.genre.filter((g) => g.id !== action.payload.id)
      }
    default:
      return state
  }
}
