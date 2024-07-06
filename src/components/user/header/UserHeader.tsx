import { Skeleton } from '@mui/material'
import { useMemo } from 'react'

import { ImageLoader } from '~/components/image'
import { Avatar } from '~/components/placeholder'
import { User } from '~/entities'
import { useAuth } from '~/providers/auth'
import { cn } from '~/utils'

type Props = {
  className?: string
  user?: User
  isLoading?: boolean
}

export const UserHeader = ({ className, user: definedUser, isLoading }: Props) => {
  const { user } = useAuth()

  const finalUser = definedUser || user

  const userAvatarPlaceholder = useMemo(() => {
    if (finalUser?.firstName && finalUser?.lastName) {
      const firstNameChar = finalUser?.firstName?.trim?.()?.[0]?.toUpperCase?.()
      const lastNameChar = finalUser?.lastName?.trim?.()?.[0]?.toUpperCase?.()

      return `${firstNameChar}.${lastNameChar}.`
    }

    if (finalUser?.username) {
      return finalUser?.username?.slice(0, 4)
    }

    return 'Пусто'
  }, [finalUser])

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <ImageLoader
        defaultPlaceholder={<Avatar text={userAvatarPlaceholder} className="w-[80px] h-[80px] rounded-[50%]" />}
        src={finalUser?.avatarUrl || ''}
        className="w-[80px] h-[80px] object-cover rounded-[50%]"
        alt={`Avatar of ${finalUser?.username}`}
        isLoading={isLoading}
      />
      {isLoading ? (
        <Skeleton className="mt-1" variant="rectangular" width={100} height={28} />
      ) : (
        <p className="text-lg text-slate-900 dark:text-white">Вишлист | @{finalUser?.username}</p>
      )}
    </div>
  )
}
