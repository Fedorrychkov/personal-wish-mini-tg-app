import { useMutation, useQueryClient } from 'react-query'

import { ClientTransactionApi, Transaction } from '~/entities'

type QueryDataType = Transaction | Transaction[] | { pages: { list: Transaction[]; total: number }[] } | undefined

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
            queryClient.setQueryData<QueryDataType>(key || '', (forms) => {
              if (!forms) {
                return data
              }

              // Проверка на пагинированные данные
              if (!Array.isArray(forms) && 'pages' in forms) {
                return {
                  ...forms,
                  pages: forms.pages.map((page) => ({
                    ...page,
                    list: page.list.map((item) => (item.id === data.id ? data : item)),
                  })),
                }
              }

              // Проверка на массив транзакций
              if (Array.isArray(forms)) {
                return forms.map((item) => (item.id === data.id ? data : item))
              }

              // Если это одиночная транзакция
              return data
            })
          }
        : undefined,
    },
  )
}
