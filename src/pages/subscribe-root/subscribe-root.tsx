import { Alert, Skeleton } from '@mui/material'
import { NavLink, useLocation, useParams } from 'react-router-dom'

import { HeartEmoji } from '~/assets'
import { Favorite } from '~/components/favorite'
import { UserHeader } from '~/components/user'
import { useTgBack } from '~/hooks'
import { DefaultLayout } from '~/layouts/default'
import { useUserDataQuery, useUserFavoriteSubscribesQuery } from '~/query'
import { ROUTE } from '~/router'

export const SubscribeRoot = () => {
  useTgBack({ defaultBackPath: ROUTE.home })

  const { id: userId } = useParams()
  const location = useLocation()
  const { data: definedUser } = useUserDataQuery(userId || '', userId, !!userId)

  const { type } = location.state || { type: 'subscribes' }

  const { data: favorites, isLoading } = useUserFavoriteSubscribesQuery(userId || '', type, !!userId)

  return (
    <DefaultLayout className="!px-0">
      <UserHeader
        user={definedUser}
        className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4"
        editable={false}
      />
      <div className="px-4">
        <div className="py-4 flex justify-between items-center">
          <h3 className="text-xl bold text-slate-900 dark:text-white mt-2">
            {type === 'subscribes' ? 'Подписки' : 'Подписчики'}
          </h3>
          <NavLink to={ROUTE.favorites} className="text-slate-900 dark:text-white gap-2 flex items-center">
            <HeartEmoji />
            Избранные
          </NavLink>
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
                favorites?.map((favorite) => (
                  <Favorite favorite={favorite} type={type} className="mb-4" key={favorite.id} isTransfer />
                ))
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
