import { UseQueryOptions } from 'react-query'

import { ClientWishApi, Wish } from '~/entities/wish'
import { useQueryBuilder } from '~/hooks'

export const useUserWishQuery = (
  definedKey: string,
  enabled = true,
  options?: Omit<UseQueryOptions<Wish[], unknown, Wish[], string>, 'queryKey' | 'queryFn'> | undefined,
) => {
  const key = `user-wish-list-${definedKey}`

  const props = useQueryBuilder({
    key,
    enabled,
    method: async () => {
      const api = new ClientWishApi()
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
