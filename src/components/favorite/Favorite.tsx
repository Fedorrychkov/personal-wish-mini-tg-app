import { Skeleton } from '@mui/material'
import { initBackButton, initHapticFeedback } from '@tma.js/sdk'
import { useCallback, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import type { Favorite as FavoriteType } from '~/entities'
import { useUserDataQuery } from '~/query'
import { ROUTE } from '~/router'
import { cn } from '~/utils'

import { ImageLoader } from '../image'
import { Avatar } from '../placeholder'

type Props = {
  favorite: FavoriteType
  className?: string
}

export const Favorite = (props: Props) => {
  const [backButton] = initBackButton()
  const haptic = initHapticFeedback()
  const navigate = useNavigate()
  const { favorite, className } = props

  backButton.show()

  const { data: favoriteUser, isLoading } = useUserDataQuery(
    favorite?.favoriteUserId || '',
    favorite?.favoriteUserId || '',
    !!favorite?.favoriteUserId,
  )

  const handleOpenUser = useCallback(() => {
    haptic.impactOccurred('medium')

    navigate(ROUTE.userWishList.replace(':id', favorite?.favoriteUserId || favoriteUser?.id || ''), {
      state: { prevPage: ROUTE.favorites },
    })
  }, [favoriteUser, favorite?.favoriteUserId, haptic, navigate])

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
    <div
      className={cn('flex gap-2 w-full bg-slate-200 dark:bg-slate-600 p-2 rounded-lg cursor-pointer', className)}
      onClick={handleOpenUser}
    >
      <div>
        <ImageLoader
          defaultPlaceholder={<Avatar text={'Пусто'} className="min-w-[64px] w-[64px] h-[64px] rounded-lg" />}
          src={favoriteUser?.avatarUrl || ''}
          isLoading={isLoading}
          className="min-w-[64px] w-[64px] h-[64px] object-cover rounded-lg"
          alt={`User Avatar ${favoriteUser?.username || favoriteUser?.id || 'никнейм не установлен'}`}
        />
      </div>
      <div className="flex-1">
        {isLoading || !favoriteUser ? (
          <>
            <Skeleton variant="rectangular" width={80} height={19} />
            <Skeleton variant="rectangular" width={100} height={24} />
          </>
        ) : (
          <>
            <Link
              to={ROUTE.userWishList?.replace(':id', favoriteUser?.id)}
              state={{ prevPage: ROUTE.favorites }}
              className="text-md text-slate-900 dark:text-white truncate"
            >
              @{favoriteUser?.username || favoriteUser?.id}
            </Link>
            <p className="text-md text-slate-900 dark:text-white truncate">
              {favorite?.wishlistNotifyEnabled ? 'Уведомления включены' : 'Уведомления отключены'}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
