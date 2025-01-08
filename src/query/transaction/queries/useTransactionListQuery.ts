import { UseQueryOptions } from 'react-query'

import { ClientTransactionApi, Transaction } from '~/entities'
import { useQueryBuilder } from '~/hooks'

export const useTransactionListQuery = (
  enabled = true,
  options?: Omit<UseQueryOptions<Transaction[], unknown, Transaction[], string>, 'queryKey' | 'queryFn'> | undefined,
) => {
  const key = 'transaction-list'

  const props = useQueryBuilder({
    key,
    enabled,
    method: async () => {
      const api = new ClientTransactionApi()
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
