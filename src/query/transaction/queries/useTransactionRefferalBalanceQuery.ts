import { UseQueryOptions } from 'react-query'

import { ClientTransactionApi, TransactionBalanceItem } from '~/entities'
import { useQueryBuilder } from '~/hooks'

export const useTransactionRefferalBalanceQuery = (
  enabled = true,
  options?:
    | Omit<UseQueryOptions<TransactionBalanceItem[], unknown, TransactionBalanceItem[], string>, 'queryKey' | 'queryFn'>
    | undefined,
) => {
  const key = 'user-blocked-refferal-balance'

  const props = useQueryBuilder({
    key,
    enabled,
    method: async () => {
      const api = new ClientTransactionApi()
      const response = await api.refferalBlockedBalance()

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
