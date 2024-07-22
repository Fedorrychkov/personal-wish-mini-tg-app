import { StepType, useTour } from '@reactour/tour'
import { useCallback, useEffect, useState } from 'react'

import { OnboardingInnerType } from '~/providers/onboarding/types'
import { useUserUpdateOnboardingMutation } from '~/query'

import { useAuth } from '../auth'
import { ONBOARDING_KEY, ONBOARDING_MAIN_STEPS } from './constants'

export const useOnboarding = (): OnboardingInnerType => {
  const { user } = useAuth()

  const { setIsOpen, steps, setSteps, setCurrentStep, currentStep } = useTour()

  const [isAvailable, setAvailable] = useState(false)

  const isNewKey = user?.appOnboardingKey !== ONBOARDING_KEY

  const onboardingMutation = useUserUpdateOnboardingMutation(user?.id || '')

  const handleUpdateOnboarding = useCallback(() => {
    if (!isNewKey) return

    onboardingMutation.mutate({ appOnboardingKey: ONBOARDING_KEY })
  }, [isNewKey, onboardingMutation])

  useEffect(() => {
    if (user?.id && isNewKey) {
      setAvailable(isNewKey)
    }
  }, [user?.appOnboardingKey, user?.id, isNewKey])

  const handleSetCurrentStep = useCallback(
    (step: number) => {
      setCurrentStep?.(step)
    },
    [setCurrentStep],
  )

  const handleOnboardingOpen = useCallback(
    (value: boolean) => {
      setIsOpen(value)
      setCurrentStep(0)
    },
    [setIsOpen, setCurrentStep],
  )

  const handleSetSteps = useCallback(
    (steps?: StepType[]) => {
      setSteps?.(steps || [])
    },
    [setSteps],
  )

  const handleClearSteps = useCallback(() => setSteps?.([]), [setSteps])

  const handleStart = useCallback(() => {
    setAvailable(false)

    handleSetSteps(ONBOARDING_MAIN_STEPS())
    handleOnboardingOpen(true)
  }, [handleSetSteps, handleOnboardingOpen])

  const handleSkip = useCallback(() => {
    setAvailable(false)

    handleSetSteps([])
    handleUpdateOnboarding()
  }, [handleSetSteps, handleUpdateOnboarding])

  return {
    isAvailable,
    steps,
    currentStep,
    isNewKey,
    handleSetSteps,
    handleSetCurrentStep,
    handleClearSteps,
    handleOnboardingOpen,
    handleStart,
    handleSkip,
  }
}
