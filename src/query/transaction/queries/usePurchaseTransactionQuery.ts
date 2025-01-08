import { UseQueryOptions } from 'react-query'

import { ClientTransactionApi, PurchaseFilter, Transaction } from '~/entities'
import { useQueryBuilder } from '~/hooks'

export const usePurchaseTransactionQuery = (
  params?: Record<string, string> & PurchaseFilter,
  enabled = true,
  options?: Omit<UseQueryOptions<Transaction[], unknown, Transaction[], string>, 'queryKey' | 'queryFn'> | undefined,
) => {
  const key = `transaction-purchase-${JSON.stringify(params)}`

  const props = useQueryBuilder({
    key,
    enabled,
    method: async () => {
      const api = new ClientTransactionApi()
      const response = await api.findPurchase({ wishId: params?.wishId })

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
