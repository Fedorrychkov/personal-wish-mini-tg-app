import { UseQueryOptions } from 'react-query'

import { ClientWishApi } from '~/entities/wish'
import { useQueryBuilder } from '~/hooks'

export const useUserWishListCountQuery = (
  userId?: string,
  options?:
    | Omit<UseQueryOptions<{ count: number }, unknown, { count: number }, string>, 'queryKey' | 'queryFn'>
    | undefined,
) => {
  const key = `user-wish-list-count-${userId}}`

  const props = useQueryBuilder({
    key,
    enabled: options?.enabled ?? true,
    method: async () => {
      const api = new ClientWishApi()
      const response = await api.listCount(userId)

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
