import { UseQueryOptions } from 'react-query'

import { ClientTransactionApi, Transaction } from '~/entities'
import { useQueryBuilder } from '~/hooks'

export const useTransactionCanRefundQuery = (
  id: string,
  enabled = true,
  options?: Omit<UseQueryOptions<Transaction, unknown, Transaction, string>, 'queryKey' | 'queryFn'> | undefined,
) => {
  const key = `transaction-can-refund-${id}`

  const props = useQueryBuilder({
    key,
    enabled,
    method: async () => {
      const api = new ClientTransactionApi()
      const response = await api.canRefund(id)

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
