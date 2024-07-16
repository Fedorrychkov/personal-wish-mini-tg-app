import { UseQueryOptions } from 'react-query'

import { ClientWishApi, Wish, WishFilter } from '~/entities/wish'
import { useQueryBuilder } from '~/hooks'

export const useUserWishQuery = (
  id: string,
  filter: WishFilter,
  options?: Omit<UseQueryOptions<Wish[], unknown, Wish[], string>, 'queryKey' | 'queryFn'> | undefined,
) => {
  const key = `user-wish-list-${id}-${Object.values(filter)}`

  const props = useQueryBuilder({
    key,
    enabled: options?.enabled ?? true,
    method: async () => {
      const api = new ClientWishApi()
      const response = await api.list(id, filter)

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
