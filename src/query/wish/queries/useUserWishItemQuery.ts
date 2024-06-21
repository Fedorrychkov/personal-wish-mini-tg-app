import { UseQueryOptions } from 'react-query'

import { ClientWishApi, Wish } from '~/entities/wish'
import { useQueryBuilder } from '~/hooks'

export const useUserWishItemQuery = (
  id: string,
  definedKey: string,
  enabled = true,
  options?: Omit<UseQueryOptions<Wish, unknown, Wish, string>, 'queryKey' | 'queryFn'> | undefined,
) => {
  const key = `user-wish-item-${id}-${definedKey}`

  const props = useQueryBuilder({
    key,
    enabled: enabled && !!id,
    method: async () => {
      const api = new ClientWishApi()
      const response = await api.get(id)

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
