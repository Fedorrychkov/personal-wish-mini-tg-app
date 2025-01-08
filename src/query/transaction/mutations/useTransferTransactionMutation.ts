import { useMutation } from 'react-query'

import { BalanceTransfer, ClientTransactionApi } from '~/entities'

export const useTransferTransactionMutation = () => {
  return useMutation((body: BalanceTransfer) => {
    const api = new ClientTransactionApi()

    return api.transfer(body)
  })
}
