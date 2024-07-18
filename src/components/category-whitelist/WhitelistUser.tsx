import { Skeleton } from '@mui/material'
import { useCallback } from 'react'
import { Link } from 'react-router-dom'

import { CloseEmoji, SaveEmoji } from '~/assets'
import { CategoryWhitelist } from '~/entities'
import { useNotifyContext } from '~/providers'
import {
  useUserCategoryWhitelistCreateMutation,
  useUserCategoryWhitelistDeleteMutation,
  useUserDataQuery,
} from '~/query'
import { ROUTE } from '~/router'
import { cn } from '~/utils'

import { ImageLoader } from '../image'
import { Avatar } from '../placeholder'

type Props = {
  userId: string
  categoryId: string
  categoryWhitelist?: CategoryWhitelist
  definedKey?: string
  type: 'add' | 'remove'
}

export const WhitelistUser = (props: Props) => {
  const { userId, categoryId, type = 'add', definedKey, categoryWhitelist } = props
  const { setNotify } = useNotifyContext()

  const { data: user, isLoading: isUserLoading } = useUserDataQuery(userId, userId, !!userId)

  const whitelistCreationMutation = useUserCategoryWhitelistCreateMutation(definedKey)
  const whitelistDeletionMutation = useUserCategoryWhitelistDeleteMutation(definedKey)

  const isLoading = isUserLoading || whitelistCreationMutation.isLoading || whitelistDeletionMutation.isLoading

  const handleUpdate = useCallback(async () => {
    if (type === 'add' && user?.id) {
      whitelistCreationMutation
        .mutateAsync({ whitelistedUserId: user.id, categoryId })
        .then(() => {
          setNotify('Пользователь успешно добавлен в список', { severity: 'success' })
        })
        .catch(() => setNotify('Пользователя не удалось добавить', { severity: 'error' }))

      return
    } else if (type === 'remove' && categoryWhitelist) {
      whitelistDeletionMutation
        .mutateAsync(categoryWhitelist?.id)
        .then(() => {
          setNotify('Пользователь успешно удален из списка', { severity: 'success' })
        })
        .catch(() => setNotify('Пользователя не удалось удалить из списка', { severity: 'error' }))

      return
    }

    setNotify('Что-то пошло не так, попробуйте выбрать другого пользователя', { severity: 'error' })
  }, [type, categoryWhitelist, whitelistDeletionMutation, whitelistCreationMutation, categoryId, user?.id, setNotify])

  return (
    <div className="flex gap-2 items-center bg-slate-300 dark:bg-slate-700 p-2 rounded-lg">
      {isLoading ? (
        <>
          <ImageLoader
            defaultPlaceholder={<Avatar className="min-w-[30px] w-[30px] h-[30px] rounded-lg" />}
            isLoading={isLoading}
            className="min-w-[30px] w-[30px] h-[30px] object-cover rounded-lg"
            alt="User loading"
          />
          <Skeleton className="rounded-lg mr-[12px]" variant="rectangular" width={'100%'} height={24} />
        </>
      ) : (
        <>
          <div className="flex flex-1 gap-2 items-center">
            <ImageLoader
              defaultPlaceholder={<Avatar className="min-w-[30px] w-[30px] h-[30px] rounded-lg" />}
              src={user?.avatarUrl || ''}
              isLoading={isLoading}
              className="min-w-[30px] w-[30px] h-[30px] object-cover rounded-lg"
              alt={`User Avatar ${user?.username || user?.id || 'никнейм не установлен'}`}
            />
            <Link
              to={ROUTE.userWishList?.replace(':id', userId)}
              state={{ prevPage: ROUTE.category?.replace(':id', categoryId) }}
              className="text-md text-blue-500 dark:text-blue-200 truncate"
            >
              @{user?.username || user?.id}
            </Link>
          </div>
          <div>
            <button
              type="button"
              onClick={handleUpdate}
              className={cn(
                'rounded-lg px-2 py-1 bg-slate-200 dark:bg-slate-400 hover:opacity-[0.6] flex gap-2 items-center',
              )}
            >
              {type === 'add' ? <SaveEmoji className="text-xl" /> : <CloseEmoji className="text-xl" />}
              {type === 'add' ? 'Добавить' : 'Удалить'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
