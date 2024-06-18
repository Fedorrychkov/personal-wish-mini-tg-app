import { UseQueryOptions } from 'react-query'

import { User } from '~/entities'
import { ClientUserApi } from '~/entities/user/api'
import { useQueryBuilder } from '~/hooks'

export const useUserDataQuery = (
  definedKey: string,
  enabled = true,
  options?: Omit<UseQueryOptions<User, unknown, User, string>, 'queryKey' | 'queryFn'> | undefined,
) => {
  const key = `user-data-${definedKey}`

  const props = useQueryBuilder({
    key,
    enabled,
    method: async () => {
      const api = new ClientUserApi()
      const response = await api.getUser()

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
