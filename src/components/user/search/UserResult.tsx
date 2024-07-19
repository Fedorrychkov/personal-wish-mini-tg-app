import { Skeleton } from '@mui/material'
import { ReactNode, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { ImageLoader } from '~/components/image'
import { Avatar } from '~/components/placeholder'
import { User } from '~/entities'
import { ROUTE } from '~/router'
import { cn } from '~/utils'

type Props = {
  user: User
  className?: string
  isLoading?: boolean
  bottomContaner?: ReactNode
}

export const UserResult = ({ user, className, isLoading, bottomContaner }: Props) => {
  const navigate = useNavigate()

  const handleOpenUser = useCallback(() => {
    navigate(ROUTE.userWishList.replace(':id', user?.id), {
      state: { prevPage: ROUTE.favorites },
    })
  }, [navigate, user?.id])

  return (
    <div
      className={cn('flex gap-2 w-full bg-slate-200 dark:bg-slate-600 p-2 rounded-lg cursor-pointer', className)}
      onClick={handleOpenUser}
    >
      <div>
        <ImageLoader
          defaultPlaceholder={<Avatar text={'Пусто'} className="min-w-[64px] w-[64px] h-[64px] rounded-lg" />}
          src={user?.avatarUrl || ''}
          className="min-w-[64px] w-[64px] h-[64px] object-cover rounded-lg"
          alt={`User Avatar ${user?.username || user?.id || 'никнейм не установлен'}`}
        />
      </div>
      <div className="flex-1">
        {isLoading || !user ? (
          <>
            <Skeleton variant="rectangular" width={80} height={19} />
            <Skeleton variant="rectangular" width={100} height={24} />
          </>
        ) : (
          <>
            <Link
              to={ROUTE.userWishList?.replace(':id', user?.id)}
              state={{ prevPage: ROUTE.favorites }}
              className="text-md text-slate-900 dark:text-white truncate"
            >
              @{user?.username || user?.id}
            </Link>
            {bottomContaner}
          </>
        )}
      </div>
    </div>
  )
}
