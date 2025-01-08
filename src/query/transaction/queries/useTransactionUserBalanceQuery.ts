import { UseQueryOptions } from 'react-query'

import { ClientTransactionApi, TransactionBalanceItem } from '~/entities'
import { useQueryBuilder } from '~/hooks'

export const useTransactionUserBalanceQuery = (
  enabled = true,
  options?:
    | Omit<UseQueryOptions<TransactionBalanceItem[], unknown, TransactionBalanceItem[], string>, 'queryKey' | 'queryFn'>
    | undefined,
) => {
  const key = 'user-balance'

  const props = useQueryBuilder({
    key,
    enabled,
    method: async () => {
      const api = new ClientTransactionApi()
      const response = await api.balance()

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
