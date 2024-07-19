import { Alert, Button, Skeleton } from '@mui/material'
import { MouseEvent, useCallback, useEffect, useState } from 'react'

import { Favorite } from '~/components/favorite'
import { useFavoriteSettledByPopup } from '~/components/favorite/hooks'
import { SearchUser, UserHeader, UserResult } from '~/components/user'
import { User } from '~/entities'
import { DefaultLayout } from '~/layouts/default'
import { useAuth, useCustomization } from '~/providers'
import { useUserFavoritesQuery } from '~/query'

export const Favorites = () => {
  const { user } = useAuth()
  const { data: favorites, isLoading, key: definedKey } = useUserFavoritesQuery(user?.id || '', !!user?.id)
  const [searchedData, setSearchedData] = useState<User | undefined>()

  const handleSearched = (user?: User) => {
    setSearchedData(user)
  }

  const { updateUserCustomizationId } = useCustomization()

  useEffect(() => {
    updateUserCustomizationId(user?.id)
  }, [user?.id, updateUserCustomizationId])

  const { handleFavoritePopup, isLoading: isLoadingFavoriteSettled } = useFavoriteSettledByPopup(definedKey, () => {
    setSearchedData(undefined)
  })

  const handleCreateFavorite = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e?.preventDefault()
      e?.stopPropagation()

      handleFavoritePopup({ favoriteUserId: searchedData?.id || '', wishlistNotifyEnabled: false }, searchedData)
    },
    [searchedData, handleFavoritePopup],
  )

  return (
    <DefaultLayout className="!px-0">
      <UserHeader className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4" editable={false} />
      <div className="px-4">
        <div className="py-4 flex justify-between items-center">
          <h3 className="text-xl bold text-slate-900 dark:text-white mt-2">Избранные</h3>
        </div>

        <div className="w-full h-[1px] bg-gray-400" />
        <div className="my-3 p-3 rounded-lg bg-slate-200/[.5] dark:bg-slate-900/[.5]">
          <SearchUser
            onSearched={handleSearched}
            knowedUserIds={favorites?.map((favorite) => favorite.favoriteUserId)}
          />

          {searchedData && (
            <div className="flex-col gap-2 my-4">
              <h3 className="text-md text-slate-900 dark:text-white my-2">Найденный пользователь</h3>

              <UserResult
                user={searchedData}
                isLoading={isLoadingFavoriteSettled}
                bottomContaner={
                  <div className="mt-2">
                    <Button
                      color="primary"
                      size="small"
                      type="submit"
                      variant="text"
                      disabled={isLoading}
                      onClick={handleCreateFavorite}
                    >
                      Добавить пользователя в избранное
                    </Button>
                  </div>
                }
              />
            </div>
          )}
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
