import { useMemo } from 'react'

import { Category } from '~/entities'
import { useAuth } from '~/providers'
import { useCategoryWhitelistQuery, useUserFavoritesQuery } from '~/query'

import { CategoryWhitelistSkeleton } from './skeletons'
import { WhitelistUser } from './WhitelistUser'

type Props = {
  category: Category
}

export const CategoryWhitelist = (props: Props) => {
  const { user } = useAuth()
  const { category } = props

  const { data: favorites, isLoading: isFavoritesLoading } = useUserFavoritesQuery(user?.id || '', !!user?.id)

  const {
    data: whitelist,
    isLoading: isWhitelistLoading,
    key: definedWhitelistKey,
  } = useCategoryWhitelistQuery(
    user?.id || '',
    {
      categoryId: category?.id,
    },
    !!category?.isPrivate,
  )

  const { data: allUserWhitelist, isLoading: isAllWhitelistLoading } = useCategoryWhitelistQuery(
    user?.id || '',
    {},
    !!category?.isPrivate,
  )

  const unwhitelistedUsers = useMemo(() => {
    const filteredFavorites = favorites?.filter(
      (favorite) => !whitelist?.find((whitelistItem) => whitelistItem.whitelistedUserId === favorite.favoriteUserId),
    )

    const filteredAllWhitelist = allUserWhitelist?.filter(
      (allWhitelist) =>
        !whitelist?.find((whitelistItem) => whitelistItem.whitelistedUserId === allWhitelist?.whitelistedUserId),
    )

    const favoriteUsers: { userId: string }[] | undefined = filteredFavorites?.map((favorite) => ({
      userId: favorite.favoriteUserId,
    }))

    const allWhitelistedUsers: { userId: string }[] | undefined = filteredAllWhitelist?.map((whitelist) => ({
      userId: whitelist?.whitelistedUserId,
    }))

    const set = new Set<string>()

    for (const user of [...(favoriteUsers || []), ...(allWhitelistedUsers || [])]) {
      set.add(user?.userId)
    }

    return [...set.values()]
  }, [favorites, whitelist, allUserWhitelist])

  const isLoading = isFavoritesLoading || isWhitelistLoading || isAllWhitelistLoading

  return (
    <div className="gap-4 flex flex-col">
      {isLoading ? (
        <CategoryWhitelistSkeleton />
      ) : (
        <div>
          <div className="flex justify-between items-center">
            <h3 className="text-md bold text-slate-900 dark:text-white mb-4">
              Управление списком доступа к приватной категории
            </h3>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">Кого можно добавить:</p>
            <div className="flex flex-col gap-3">
              {unwhitelistedUsers?.length ? (
                <>
                  {unwhitelistedUsers?.map((unwhitelistedUserId) => (
                    <WhitelistUser
                      key={unwhitelistedUserId}
                      definedKey={definedWhitelistKey}
                      userId={unwhitelistedUserId}
                      categoryId={category.id}
                      type="add"
                    />
                  ))}
                </>
              ) : (
                <>
                  <p className="text-sm text-slate-900 dark:text-white">
                    Нет пользователей к добавлению, обновите список избранных
                  </p>
                </>
              )}
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-4 mb-2">
              Добавленные в список пользователи:
            </p>
            <div className="flex flex-col gap-3">
              {whitelist?.length ? (
                <>
                  {whitelist?.map((whitelistItem) => (
                    <WhitelistUser
                      key={whitelistItem.whitelistedUserId}
                      definedKey={definedWhitelistKey}
                      userId={whitelistItem.whitelistedUserId}
                      categoryId={whitelistItem.categoryId}
                      categoryWhitelist={whitelistItem}
                      type="remove"
                    />
                  ))}
                </>
              ) : (
                <>
                  <p className="text-sm text-slate-900 dark:text-white">Этот список никто не видит</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
