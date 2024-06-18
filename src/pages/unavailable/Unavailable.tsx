import { initBackButton, initHapticFeedback } from '@tma.js/sdk'

import { DefaultLayout } from '~/layouts/default'

export const Unavailable = () => {
  const hapticFeedback = initHapticFeedback()
  const [backButton] = initBackButton()
  backButton.hide()

  hapticFeedback.impactOccurred('heavy')

  return (
    <DefaultLayout>
      <h1 className="text-3xl font-bold underline text-slate-900 dark:text-white">Oops!</h1>
      <p className="read-the-docs text-slate-900 dark:text-white">
        Произошла непредвиденная ошибка, пожалуйста, попробуйте позже
      </p>
    </DefaultLayout>
  )
}
