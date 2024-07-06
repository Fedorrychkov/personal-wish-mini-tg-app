import { UseQueryOptions } from 'react-query'

import { ClientWishApi, Wish } from '~/entities/wish'
import { useQueryBuilder } from '~/hooks'

export const useUserWishQuery = (
  id: string,
  enabled = true,
  options?: Omit<UseQueryOptions<Wish[], unknown, Wish[], string>, 'queryKey' | 'queryFn'> | undefined,
) => {
  const key = `user-wish-list-${id}`

  const props = useQueryBuilder({
    key,
    enabled,
    method: async () => {
      const api = new ClientWishApi()
      const response = await api.list(id)

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
