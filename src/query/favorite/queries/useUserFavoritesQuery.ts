import { UseQueryOptions } from 'react-query'

import { ClientFavoriteApi, Favorite } from '~/entities'
import { useQueryBuilder } from '~/hooks'

export const useUserFavoritesQuery = (
  id: string,
  enabled = true,
  options?: Omit<UseQueryOptions<Favorite[], unknown, Favorite[], string>, 'queryKey' | 'queryFn'> | undefined,
) => {
  const key = `user-favorite-list-${id}`

  const props = useQueryBuilder({
    key,
    enabled,
    method: async () => {
      const api = new ClientFavoriteApi()
      const response = await api.list()

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
