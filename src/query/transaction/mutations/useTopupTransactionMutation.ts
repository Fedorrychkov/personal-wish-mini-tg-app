import { useMutation } from 'react-query'

import { ClientTransactionApi, TransactionBalanceTopup } from '~/entities'

export const useTopupTransactionMutation = () => {
  return useMutation((body: TransactionBalanceTopup) => {
    const api = new ClientTransactionApi()

    return api.topup(body)
  })
}
