import { ClientTransactionApi, Transaction } from '~/entities'
import { InfiniteQueryProps, useInfiniteQueryBuilder } from '~/hooks'
import { PaginationResponse } from '~/types'

export const useTransactionListQuery = (
  enabled = true,
  options?: InfiniteQueryProps<PaginationResponse<Transaction>, unknown>['options'],
) => {
  const key = 'transaction-list'

  const props = useInfiniteQueryBuilder({
    key,
    enabled,
    method: async ({ pageParam }) => {
      const api = new ClientTransactionApi()
      const response = await api.list(pageParam)

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
// export const useTransactionListQuery = (
//   enabled = true,
//   options?: Omit<UseQueryOptions<Transaction[], unknown, Transaction[], string>, 'queryKey' | 'queryFn'> | undefined,
// ) => {
//   const key = 'transaction-list'

//   const props = useQueryBuilder({
//     key,
//     enabled,
//     method: async () => {
//       const api = new ClientTransactionApi()
//       const response = await api.list()

//       return response
//     },
//     options: {
//       retry: 0,
//       ...options,
//     },
//   })

//   return {
//     ...props,
//     key,
//   }
// }
