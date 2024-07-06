import { Button, Skeleton } from '@mui/material'
import { initBackButton, initHapticFeedback } from '@tma.js/sdk'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { UserHeader } from '~/components/user'
import { WishItem } from '~/components/wish'
import { DefaultLayout } from '~/layouts/default'
import { useAuth } from '~/providers/auth'
import { useUserWishQuery } from '~/query'
import { ROUTE } from '~/router'

export const Home = () => {
  const [backButton] = initBackButton()
  const haptic = initHapticFeedback()
  const { user } = useAuth()
  const { data, isLoading, key } = useUserWishQuery(`${user?.id}`)
  const navigate = useNavigate()

  const handleAddWish = useCallback(() => {
    haptic.impactOccurred('soft')

    navigate(ROUTE.wishNew)
  }, [haptic, navigate])

  backButton.hide()

  return (
    <DefaultLayout className="!px-0">
      <UserHeader className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4" />
      <div className="px-4">
        <div className="py-4 flex justify-between items-center">
          <h3 className="text-xl bold text-slate-900 dark:text-white mt-2">Желания</h3>
          <Button color="primary" type="button" onClick={handleAddWish} size="small" variant="text">
            Добавить
          </Button>
        </div>
        <div className="w-full h-[1px] bg-gray-400" />

        <div className="mt-2 gap-4">
          {isLoading ? (
            <>
              <Skeleton className="mb-4 rounded-lg" variant="rectangular" width="100%" height={118} />
              <Skeleton className="mb-4 rounded-lg" variant="rectangular" width="100%" height={118} />
              <Skeleton className="mb-4 rounded-lg" variant="rectangular" width="100%" height={118} />
            </>
          ) : (
            <>{data?.map((wish) => <WishItem className="mb-4" key={wish.id} listKey={key} wish={wish} />)}</>
          )}
        </div>
      </div>
    </DefaultLayout>
  )
}
