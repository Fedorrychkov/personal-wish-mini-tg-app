import { ProviderProps, StepType } from '@reactour/tour'

export type OnboardingInnerType = {
  currentStep: number
  handleSetSteps: (steps?: StepType[]) => void
  handleClearSteps: () => void
  handleStart: () => void
  handleSkip: () => void
  handleSetCurrentStep: (step: number) => void
  handleOnboardingOpen: (value: boolean) => void
  steps?: StepType[]
  isAvailable?: boolean
  isNewKey?: boolean
}

export type OnboardingType = Omit<ProviderProps, 'children' | 'steps'> &
  Omit<OnboardingInnerType, 'handleSetCurrentStep' | 'handleOnboardingOpen'>
