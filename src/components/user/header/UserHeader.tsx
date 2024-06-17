import { useMemo } from 'react'

import { ImageLoader } from '~/components/image'
import { Avatar } from '~/components/placeholder'
import { useAuth } from '~/providers/auth'
import { cn } from '~/utils'

type Props = {
  className?: string
}

export const UserHeader = ({ className }: Props) => {
  const { user } = useAuth()

  const userAvatarPlaceholder = useMemo(() => {
    if (user?.firstName && user?.lastName) {
      const firstNameChar = user?.firstName?.trim?.()?.[0]?.toUpperCase?.()
      const lastNameChar = user?.lastName?.trim?.()?.[0]?.toUpperCase?.()

      return `${firstNameChar}.${lastNameChar}.`
    }

    return 'empty'
  }, [user])

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <ImageLoader
        defaultPlaceholder={<Avatar text={userAvatarPlaceholder} className="w-[80px] h-[80px] rounded-[50%]" />}
        src={user?.avatarUrl || ''}
        className="w-[80px] h-[80px] object-cover rounded-[50%]"
        alt={`Avatar of ${user?.username}`}
      />
      <p className="text-lg text-slate-900 dark:text-white">Вишлист | @{user?.username}</p>
    </div>
  )
}
