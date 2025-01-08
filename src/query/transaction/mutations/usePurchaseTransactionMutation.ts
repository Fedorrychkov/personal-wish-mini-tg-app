import { useMutation, useQueryClient } from 'react-query'

import { ClientTransactionApi, Purchase, Transaction } from '~/entities'

export const usePurchaseTransactionMutation = (key?: string) => {
  const queryClient = useQueryClient()

  return useMutation(
    (body: Purchase) => {
      const api = new ClientTransactionApi()

      return api.purchase(body)
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
