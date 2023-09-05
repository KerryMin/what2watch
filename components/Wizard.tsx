import React from 'react'

interface WizardProps {
  steps: React.ReactNode[]
  initialStep?: number
  isNextDisabled?: boolean
  isBackDisabled?: boolean
  currentStep: number
  onNext: (isFinal: boolean) => void
  onBack: () => void
}

const Wizard: React.FC<WizardProps> = ({
  steps,
  isNextDisabled = false,
  isBackDisabled = false,
  currentStep,
  onNext,
  onBack
}) => {
  function handleNext() {
    onNext(currentStep === steps.length - 1)
  }
  function handleBack() {
    onBack()
  }
  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        {currentStep > 0 ? (
          <button
            onClick={handleBack}
            className={`px-4 py-2 bg-gray-600 text-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 hover:bg-gray-700 ${
              isBackDisabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isBackDisabled}
          >
            Back
          </button>
        ) : (
          <div />
        )}
        <button
          onClick={handleNext}
          className={`px-4 py-2 bg-blue-600 text-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:bg-blue-700 ${
            isNextDisabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isNextDisabled}
        >
          {currentStep < steps.length - 1 ? 'Next' : 'Finish'}
        </button>
      </div>
      <div>{steps[currentStep]}</div>
      {/* NOTE: code to jump to dif places */}
      {/* <div className='space-x-2'>
        <div className='space-x-2 mt-4'>
          {Array.from({ length: steps.length }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => jumpToStep(idx + 1)}
              className='px-3 py-1 bg-green-500 text-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 hover:bg-green-600'
            >
              Go to Step {idx + 1}
            </button>
          ))}
        </div>
      </div> */}
    </div>
  )
}

export default Wizard
