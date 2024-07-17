import { UseQueryOptions } from 'react-query'

import { CategoryWhitelist, CategoryWhitelistFilter, ClienCategoryWhitelistApi } from '~/entities'
import { useQueryBuilder } from '~/hooks'

export const useCategoryWhitelistQuery = (
  id: string,
  filter: CategoryWhitelistFilter,
  enabled = true,
  options?:
    | Omit<UseQueryOptions<CategoryWhitelist[], unknown, CategoryWhitelist[], string>, 'queryKey' | 'queryFn'>
    | undefined,
) => {
  const key = `category-whitelist-${id}-${Object.values(filter)}`

  const props = useQueryBuilder({
    key,
    enabled,
    method: async () => {
      const api = new ClienCategoryWhitelistApi()
      const response = await api.list(filter)

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
