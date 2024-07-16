import { UseQueryOptions } from 'react-query'

import { Category, ClienCategoryApi } from '~/entities'
import { useQueryBuilder } from '~/hooks'

export const useCategoryQuery = (
  id: string,
  enabled = true,
  options?: Omit<UseQueryOptions<Category, unknown, Category, string>, 'queryKey' | 'queryFn'> | undefined,
) => {
  const key = `category-${id}`

  const props = useQueryBuilder({
    key,
    enabled,
    method: async () => {
      const api = new ClienCategoryApi()
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
