import { initBackButton } from '@tma.js/sdk'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { WishForm, WishImageContainer } from '~/components/wish'
import { DefaultLayout } from '~/layouts/default'
import { ROUTE } from '~/router'

export const NewWish = () => {
  const navigate = useNavigate()
  const [backButton] = initBackButton()
  const [wishImage, setWishImage] = useState<File | undefined>()

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
      <WishImageContainer isEditable onSaveImage={setWishImage} />

      <WishForm wishImage={wishImage} onCancel={handleOpenHome} />
    </DefaultLayout>
  )
}
