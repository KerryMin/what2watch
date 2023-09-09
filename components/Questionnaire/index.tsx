import { useCallback } from 'react'
import Wizard from '../Wizard'
import { useQuestionnaireContext } from './Context'
import { AiPrompt, SelectGenre, SelectMediaType } from './steps'
import { fetchCall } from '@/helpers/nextHelpers'
const steps = [<SelectMediaType />, <SelectGenre />, <AiPrompt />]

function QuestionnaireContent() {
  const context = useQuestionnaireContext()
  const isNextDisabled = useCallback(() => {
    const isDisabled =
      (!context.state.mediaType.length && !context.state.step) ||
      (!context.state.genre.length && !!context.state.step)
    return isDisabled
  }, [context.state])

  async function handleFinish() {
    context.questionsModalDisclosure.onClose()
  }

  function handleNext(isFinal: boolean) {
    if (isFinal) {
      handleFinish()
    } else {
      context.changeStep(context.state.step + 1)
    }
  }

  function handleBack() {
    context.changeStep(context.state.step - 1)
  }

  return (
    <Wizard
      currentStep={context.state.step}
      isNextDisabled={isNextDisabled()}
      steps={steps}
      onNext={handleNext}
      onBack={handleBack}
    />
  )
}
export default function Questionnaire() {
  return (
    <div style={{ height: '70vh' }}>
      <QuestionnaireContent />
    </div>
  )
}
