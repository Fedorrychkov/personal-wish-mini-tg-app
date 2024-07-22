import { useCallback, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { ImageLoader } from '~/components/image'
import { Spinner } from '~/components/loaders'
import { ROUTE } from '~/router'

import { useOnboarding } from './useOnboarding'

export const OnboardingWelcome = () => {
  const [isLoading, setLoading] = useState(false)
  const location = useLocation()

  const { isAvailable, handleStart, handleSkip } = useOnboarding()

  const handleStartOnboarding = useCallback(() => {
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      handleStart()
    }, 1000)
  }, [handleStart])

  if (!isAvailable || location.pathname !== ROUTE.home) {
    return null
  }

  return (
    <div className="bg-slate-100 dark:bg-slate-900 z-[10] fixed left-0 top-0 bottom-0 right-0 flex flex-col justify-between">
      <div className="flex flex-col items-center justify-center p-6">
        <ImageLoader className="w-[128px] h-[128px]" src="images/icons/icon-128x128.png" />
      </div>
      <div className="flex flex-1 flex-col items-start px-6 py-2 bg-slate-900 dark:bg-slate-200 rounded-xl">
        <div className="flex flex-1 flex-col">
          <h1 className="text-xl font-bold dark:text-slate-900 text-white mt-2">
            Добро пожаловать в ваш список желаний
          </h1>
          <p className="text-sm dark:text-slate-700 text-slate-300 mt-2">
            Так как вы заходите первый раз или не прошли/не отменили знакомство с приложением в прошлый, предлагаю
            пройти небольшой тур по функционалу приложения.
          </p>
        </div>
        <div className="pt-2 pb-6 gap-4 flex flex-col">
          <p className="dark:text-slate-900 text-white mt-2">
            Вы всегда можете остановить тур или снова пройти его нажав на иконку на главной странице, в углу приложения
          </p>
          <div className="flex gap-4 items-center justify-between">
            <button
              type="button"
              onClick={handleSkip}
              disabled={isLoading}
              className="w-[140px] rounded-xl p-4 text-white dark:text-slate-900 font-bold hover:opacity-[0.8]"
            >
              Пропустить
            </button>
            <button
              type="button"
              onClick={handleStartOnboarding}
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-blue-600 rounded-xl p-4 text-white font-bold hover:opacity-[0.8]"
            >
              {isLoading ? <Spinner className="!w-[24px] !h-[24px]" /> : 'Начать знакомство'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
