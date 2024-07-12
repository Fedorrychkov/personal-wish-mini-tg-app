import { UseQueryOptions } from 'react-query'

import { ClientFavoriteApi, Favorite } from '~/entities'
import { useQueryBuilder } from '~/hooks'

export const useUserFavoriteQuery = (
  params: { userId: string; favoriteUserId: string },
  enabled = true,
  options?: Omit<UseQueryOptions<Favorite, unknown, Favorite, string>, 'queryKey' | 'queryFn'> | undefined,
) => {
  const { userId, favoriteUserId } = params || {}
  const key = `user-favorite-state-${userId}-${favoriteUserId}`

  const props = useQueryBuilder({
    key,
    enabled,
    method: async () => {
      const api = new ClientFavoriteApi()
      const response = await api.get(favoriteUserId)

      return response
    },
    options: {
      retry: 0,
      ...options,
    },
  })

  return {
    ...props,
    key,
  }
}
