import { UseQueryOptions } from 'react-query'

import { ClientFavoriteApi, Favorite } from '~/entities'
import { useQueryBuilder } from '~/hooks'

export const useUserFavoriteSubscribesQuery = (
  userId: string,
  type: 'subscribes' | 'subscribers',
  enabled = true,
  options?: Omit<UseQueryOptions<Favorite[], unknown, Favorite[], string>, 'queryKey' | 'queryFn'> | undefined,
) => {
  const key = `user-favorite-list-${userId}-${type}`

  const props = useQueryBuilder({
    key,
    enabled,
    method: async () => {
      const api = new ClientFavoriteApi()
      const response = type === 'subscribes' ? await api.subscribes(userId) : await api.subscribers(userId)

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
