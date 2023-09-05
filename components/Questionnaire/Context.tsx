import React, { createContext, useContext, useReducer } from 'react'
import { initialState, reducer, State, Action } from './reducer'
import { ListItem } from '../CardList'

type QuestionnaireContextProps = {
  state: State // Replace any with the type of your state
  dispatch: React.Dispatch<Action> // Replace any with your action type
  addMediaType: (payload: ListItem) => void
  removeMediaType: (id: string) => void
  addGenre: (payload: ListItem) => void
  removeGenre: (id: string) => void
  changeStep: (step: number) => void
  updateAiPrompt: (prompt: string) => void
}

const QuestionnaireContext = createContext<
  QuestionnaireContextProps | undefined
>(undefined)

type QuestionnaireProps = {
  children: React.ReactNode
}

export const QuestionnaireProvider: React.FC<QuestionnaireProps> = ({
  children
}) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const addMediaType = (payload: ListItem) => {
    dispatch({
      type: 'ADD_MEDIA_TYPE',
      payload
    })
  }

  const removeMediaType = (id: string) => {
    dispatch({
      type: 'REMOVE_MEDIA_TYPE',
      payload: { id }
    })
  }

  const addGenre = (payload: ListItem) => {
    dispatch({
      type: 'ADD_GENRE',
      payload
    })
  }

  const removeGenre = (id: string) => {
    dispatch({
      type: 'REMOVE_GENRE',
      payload: { id }
    })
  }
  const changeStep = (payload: number) => {
    dispatch({
      type: 'CHANGE_STEP',
      payload
    })
  }
  const updateAiPrompt = (payload: string) => {
    dispatch({
      type: 'CHANGE_AI_PROMPT',
      payload
    })
  }
  return (
    <QuestionnaireContext.Provider
      value={{
        state,
        dispatch,
        addMediaType,
        removeMediaType,
        addGenre,
        removeGenre,
        changeStep,
        updateAiPrompt
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  )
}

export function useQuestionnaireContext(): QuestionnaireContextProps {
  const context = useContext(QuestionnaireContext)
  if (!context) {
    throw new Error(
      'useQuestionnaireContext must be used within an Questionnaire'
    )
  }
  return context
}
