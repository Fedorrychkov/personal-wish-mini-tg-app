import { StepType, TourProvider } from '@reactour/tour'
import React, { useCallback, useMemo } from 'react'

import { useUserUpdateOnboardingMutation } from '~/query'

import { useAuth } from '../auth'
import { ONBOARDING_KEY } from './constants'
import { OnboardingNavigation } from './OnboardingNavigation'

type Props = {
  children?: React.ReactNode
}

export const OnboardingContainerProvider: React.FC<Props> = ({ children }) => {
  const { user } = useAuth()
  const onboardingMutation = useUserUpdateOnboardingMutation(user?.id || '')

  const isNewKey = user?.appOnboardingKey !== ONBOARDING_KEY

  const handleUpdateOnboarding = useCallback(() => {
    if (!isNewKey) return

    onboardingMutation.mutate({ appOnboardingKey: ONBOARDING_KEY })
  }, [isNewKey, onboardingMutation])

  const disableBody = useCallback(() => {
    document?.querySelector('body')?.setAttribute('data-scroll', 'false')
  }, [])

  const enableBody = useCallback(() => {
    document?.querySelector('body')?.setAttribute('data-scroll', 'true')

    handleUpdateOnboarding()
  }, [handleUpdateOnboarding])

  const components = useMemo(
    () => ({
      Navigation: OnboardingNavigation,
    }),
    [],
  )

  const handleClickMask = useCallback(
    (props: {
      steps?: StepType[]
      currentStep: number
      setCurrentStep: (number: number) => void
      setIsOpen: (value: boolean) => void
    }) => {
      if (props?.steps && props.currentStep < props.steps?.length - 1) {
        props.setCurrentStep(props.currentStep + 1)

        return false
      }

      props.setIsOpen(false)
    },
    [],
  )

  return (
    <TourProvider
      showCloseButton={false}
      steps={[]}
      disableInteraction
      afterOpen={disableBody}
      beforeClose={enableBody}
      onClickMask={handleClickMask}
      className="!p-4 rounded-lg !bg-slate-200 dark:!bg-slate-800"
      showBadge={false}
      components={components}
    >
      {children}
    </TourProvider>
  )
}
