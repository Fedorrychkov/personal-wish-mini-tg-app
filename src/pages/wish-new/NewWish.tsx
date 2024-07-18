import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { WishForm, WishImageContainer } from '~/components/wish'
import { useTgBack } from '~/hooks'
import { DefaultLayout } from '~/layouts/default'
import { useAuth, useCustomization } from '~/providers'
import { ROUTE } from '~/router'

export const NewWish = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [wishImage, setWishImage] = useState<File | undefined>()

  useTgBack({ defaultBackPath: ROUTE.home })

  const { updateUserCustomizationId } = useCustomization()

  useEffect(() => {
    updateUserCustomizationId(user?.id)
  }, [user?.id, updateUserCustomizationId])

  const handleOpenHome = useCallback(() => {
    navigate(ROUTE.home, { replace: true })

    return
  }, [navigate])

  return (
    <DefaultLayout className="!px-0">
      <WishImageContainer isEditable onSaveImage={setWishImage} />

      <WishForm wishImage={wishImage} onCancel={handleOpenHome} />
    </DefaultLayout>
  )
}
