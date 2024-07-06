import { initBackButton } from '@tma.js/sdk'
import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { ImageLoader } from '~/components/image'
import { WishForm } from '~/components/wish'
import { DefaultLayout } from '~/layouts/default'
import { ROUTE } from '~/router'

export const NewWish = () => {
  const navigate = useNavigate()
  const [backButton] = initBackButton()

  backButton.show()

  const handleBack = useCallback(() => {
    navigate(ROUTE.home, { replace: true })

    return
  }, [navigate])

  const handleOpenHome = useCallback(() => {
    navigate(ROUTE.home, { replace: true })

    return
  }, [navigate])

  useEffect(() => {
    backButton.on('click', handleBack)

    return () => {
      backButton.off('click', handleBack)
    }
  }, [handleBack, backButton])

  return (
    <DefaultLayout className="!px-0">
      <ImageLoader
        defaultPlaceholder={
          <div className="bg-gray-200 dark:bg-slate-400 w-full w-full h-[200px] flex items-center justify-center">
            <p>Изображение не установлено</p>
          </div>
        }
        src={''}
        className="bg-gray-200 dark:bg-slate-400 object-contain w-full w-full h-[200px]"
        alt={`Wish Image of ${'Без названия'}`}
      />

      <WishForm onCancel={handleOpenHome} />
    </DefaultLayout>
  )
}
