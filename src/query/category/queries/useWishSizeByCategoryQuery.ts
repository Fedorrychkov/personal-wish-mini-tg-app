import { UseQueryOptions } from 'react-query'

import { ClienCategoryApi } from '~/entities'
import { useQueryBuilder } from '~/hooks'

export const useWishSizeByCategoryQuery = (
  id: string,
  enabled = true,
  options?:
    | Omit<UseQueryOptions<{ count: number }, unknown, { count: number }, string>, 'queryKey' | 'queryFn'>
    | undefined,
) => {
  const key = `wish-category-count-${id}`

  const props = useQueryBuilder({
    key,
    enabled,
    method: async () => {
      const api = new ClienCategoryApi()
      const response = await api.wishCount(id)

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
