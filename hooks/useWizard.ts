import { useState } from 'react'

interface UseWizardProps {
  initialStep?: number
  totalSteps: number
}

interface UseWizardResult {
  currentStep: number
  goToNext: () => void
  goToPrev: () => void
  jumpToStep: (step: number) => void
}

export function useWizard({
  initialStep = 1,
  totalSteps
}: UseWizardProps): UseWizardResult {
  const [currentStep, setCurrentStep] = useState(initialStep)

  const goToNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1)
  }

  const goToPrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const jumpToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) setCurrentStep(step)
  }

  return {
    currentStep,
    goToNext,
    goToPrev,
    jumpToStep
  }
}
