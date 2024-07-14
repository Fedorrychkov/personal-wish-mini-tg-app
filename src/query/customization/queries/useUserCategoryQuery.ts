import { UseQueryOptions } from 'react-query'

import { ClientCustomizationApi, Customization } from '~/entities'
import { useQueryBuilder } from '~/hooks'

export const useUserCustomizationQuery = (
  id: string,
  enabled = true,
  options?: Omit<UseQueryOptions<Customization, unknown, Customization, string>, 'queryKey' | 'queryFn'> | undefined,
) => {
  const key = `user-customization-${id}`

  const props = useQueryBuilder({
    key,
    enabled,
    method: async () => {
      const api = new ClientCustomizationApi()
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
