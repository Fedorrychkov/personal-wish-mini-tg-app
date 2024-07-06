import { Skeleton } from '@mui/material'
import { initBackButton } from '@tma.js/sdk'
import { useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { UserHeader } from '~/components/user'
import { WishItem } from '~/components/wish'
import { DefaultLayout } from '~/layouts/default'
import { useUserDataQuery, useUserWishQuery } from '~/query'
import { ROUTE } from '~/router'

export const UserWishList = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [backButton] = initBackButton()
  const { data: user, isLoading: isUserLoading } = useUserDataQuery(id || '', id, !!id)
  const { data, isLoading, key } = useUserWishQuery(id || '', !!id)

  backButton.show()

  const handleBack = useCallback(() => {
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
      <UserHeader
        user={user}
        isLoading={isUserLoading}
        className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4"
      />
      <div className="px-4">
        <div className="py-4">
          <h3 className="text-xl bold text-slate-900 dark:text-white mt-2">Желания</h3>
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
