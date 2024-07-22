import { StepType } from '@reactour/tour'

export const OnboardingNavigation = (props: {
  steps: StepType[]
  currentStep: number
  setIsOpen: (state: boolean) => void
  setCurrentStep: (value: number) => void
}) => {
  const { currentStep, steps, setCurrentStep, setIsOpen } = props

  const isFinish = currentStep === steps?.length - 1
  const handleNext = () => {
    if (isFinish) {
      setIsOpen(false)

      return
    }

    setCurrentStep(currentStep + 1)
  }

  const handlePrev = () => {
    if (currentStep !== 0) {
      setCurrentStep(currentStep - 1)

      return
    }
  }

  return (
    <div className="w-full mt-4">
      <div className="w-full h-[1px] bg-gray-400" />
      <div className="flex w-full justify-between items-center gap-4 mt-2">
        <div className="flex gap-2 whitespace-nowrap font-bold text-sm text-blue-600">
          {currentStep} / {(steps?.length || 1) - 1}
        </div>
        {currentStep !== 0 && (
          <button
            type="button"
            onClick={handlePrev}
            className="text-sm flex items-center justify-center bg-blue-600 rounded-md p-2 text-white font-bold hover:opacity-[0.8]"
          >
            Назад
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          className="w-full text-sm flex items-center justify-center bg-blue-600 rounded-md p-2 text-white font-bold hover:opacity-[0.8]"
        >
          {isFinish ? 'Завершить' : 'Далее'}
        </button>
      </div>
    </div>
  )
}
