import { Alert, Skeleton } from '@mui/material'
import { useEffect } from 'react'

import { Favorite } from '~/components/favorite'
import { UserHeader } from '~/components/user'
import { DefaultLayout } from '~/layouts/default'
import { useAuth, useCustomization } from '~/providers'
import { useUserFavoritesQuery } from '~/query'

export const Favorites = () => {
  const { user } = useAuth()
  const { data: favorites, isLoading } = useUserFavoritesQuery(user?.id || '', !!user?.id)

  const { updateUserCustomizationId } = useCustomization()

  useEffect(() => {
    updateUserCustomizationId(user?.id)
  }, [user?.id, updateUserCustomizationId])

  return (
    <DefaultLayout className="!px-0">
      <UserHeader className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4" editable={false} />
      <div className="px-4">
        <div className="py-4 flex justify-between items-center">
          <h3 className="text-xl bold text-slate-900 dark:text-white mt-2">Избранные</h3>
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
            <>
              {favorites?.length ? (
                favorites?.map((favorite) => <Favorite favorite={favorite} className="mb-4" key={favorite.id} />)
              ) : (
                <div>
                  <Alert severity="info" className="dark:!bg-slate-300">
                    Вы еще не добавили ни одного пользователя в избранные. Добавляя людей в избранное, вы можете
                    получать уведомления о новых желаниях и приватных списках
                  </Alert>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DefaultLayout>
  )
}
