import { useMutation, useQueryClient } from 'react-query'

import { ClientTransactionApi, Transaction } from '~/entities'

export const useRefundTransactionMutation = (id: string, key = 'transaction-list') => {
  const queryClient = useQueryClient()

  return useMutation(
    () => {
      const api = new ClientTransactionApi()

      return api.refund(id)
    },
    {
      onSuccess: key
        ? (data: Transaction) => {
            queryClient.setQueryData<Transaction | Transaction[] | undefined>(key || '', (forms = []) => {
              if (!Array.isArray(forms)) {
                return data
              }

              const items = forms?.map((item) => {
                if (item.id === data?.id) {
                  return data
                }

                return item
              })

              return items
            })
          }
        : undefined,
    },
  )
}
