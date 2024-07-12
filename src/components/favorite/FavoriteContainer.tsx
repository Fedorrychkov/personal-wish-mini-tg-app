import { Skeleton } from '@mui/material'
import { useCallback } from 'react'

import { HeartEmoji, NotificationEmoji } from '~/assets'
import { Favorite, User } from '~/entities'
import { cn } from '~/utils'

import { useFavoriteDeleteByPopup, useFavoriteSettledByPopup, useFavoriteUpdateByPopup } from './hooks'

type Props = {
  favorite?: Favorite
  isLoading?: boolean
  definedKey?: string
  favoriteUser?: User
}

export const FavoriteContainer = (props: Props) => {
  const { favorite, isLoading, definedKey, favoriteUser } = props || {}

  const { handleFavoritePopup, isLoading: isLoadingFavoriteSettled } = useFavoriteSettledByPopup(definedKey)
  const { handleDeleteFavoritePopup, isLoading: isLoadingFavoriteDeletion } = useFavoriteDeleteByPopup(
    favoriteUser?.id || '',
    definedKey,
  )
  const { handleFavoriteUpdatePopup, isLoading: isLoadingFavoriteUpdate } = useFavoriteUpdateByPopup(definedKey)

  const isLoadingMutations = isLoadingFavoriteDeletion || isLoadingFavoriteSettled || isLoadingFavoriteUpdate

  const handleCreateFavorite = useCallback(
    () => handleFavoritePopup({ favoriteUserId: favoriteUser?.id || '', wishlistNotifyEnabled: false }, favoriteUser),
    [favoriteUser, handleFavoritePopup],
  )

  const handleUpdateFavorite = useCallback(
    () =>
      handleFavoriteUpdatePopup(
        {
          favoriteUserId: favorite?.favoriteUserId || '',
          wishlistNotifyEnabled: !!favorite?.wishlistNotifyEnabled,
        },
        favoriteUser,
      ),
    [favoriteUser, favorite, handleFavoriteUpdatePopup],
  )

  const handleDeleteFavorite = useCallback(
    () => handleDeleteFavoritePopup(favoriteUser),
    [favoriteUser, handleDeleteFavoritePopup],
  )

  return (
    <div className="flex gap-3">
      {isLoading && <Skeleton className="rounded-[50%]" variant="rectangular" width={40} height={40} />}
      <button
        type="button"
        disabled={isLoadingMutations}
        onClick={favorite?.id ? handleDeleteFavorite : handleCreateFavorite}
        className={cn('rounded-[50%] bg-slate-200 dark:bg-slate-700 w-[32px] h-[32px]', {
          'opacity-[0.6] hover:opacity-[1]': !favorite,
          'opacity-[1] hover:opacity-[0.8]': favorite,
        })}
      >
        <HeartEmoji className="text-xl" />
      </button>
      {favorite && (
        <button
          type="button"
          disabled={isLoadingMutations}
          onClick={handleUpdateFavorite}
          className={cn('rounded-[50%] bg-slate-200 dark:bg-slate-700 w-[32px] h-[32px]', {
            'opacity-[0.6] hover:opacity-[1]': !favorite?.wishlistNotifyEnabled,
            'opacity-[1] hover:opacity-[0.8]': favorite?.wishlistNotifyEnabled,
          })}
        >
          <NotificationEmoji className="text-xl" />
        </button>
      )}
    </div>
  )
}
