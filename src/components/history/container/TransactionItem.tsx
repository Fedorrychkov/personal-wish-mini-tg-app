import { AxiosError } from 'axios'
import { useCallback } from 'react'

import {
  Transaction,
  transactionCurrencyLabels,
  transactionProviderLabels,
  transactionStatusColors,
  transactionStatusIcons,
  transactionStatusLabels,
  transactionTypeColors,
  transactionTypeIcons,
  transactionTypeLabels,
} from '~/entities'
import { getErrorMessageByCode } from '~/errors'
import { useNotifyContext } from '~/providers'
import { useRefundTransactionMutation, useTransactionCanRefundQuery } from '~/query'
import { cn, time } from '~/utils'

type Props = {
  value: Transaction
  className?: string
}

export const TransactionItem = (props: Props) => {
  const { setNotify } = useNotifyContext()

  const { value, className } = props

  const { data: canRefund, error, refetch } = useTransactionCanRefundQuery(value?.id)

  const refundTransactionMutation = useRefundTransactionMutation(value?.id)

  const handleRefund = useCallback(async () => {
    try {
      await refundTransactionMutation.mutateAsync()

      setTimeout(() => refetch(), 1000)

      setNotify('Средства успешно возвращены', { severity: 'success' })
    } catch (error) {
      console.error(error)
      setTimeout(() => refetch(), 1000)

      let message = 'Произошла ошибка при возврате средств, попробуйте позже'

      if (error instanceof AxiosError) {
        message = getErrorMessageByCode(error?.response?.data?.code, message)
      }

      setNotify(message, { severity: 'error' })
    }
  }, [refundTransactionMutation, setNotify, refetch])

  return (
    <div className={cn('w-full flex gap-4 items-start justify-between w-full', className)}>
      <div className="flex flex-col gap-1">
        <p
          className={cn(
            'text-slate-500 dark:text-slate-200 text-[14px] font-medium',
            transactionTypeColors[value?.type],
          )}
        >
          {transactionTypeIcons[value?.type]} {transactionTypeLabels[value?.type]}
        </p>
        <p className="text-slate-500 dark:text-slate-200 text-[14px]">{transactionProviderLabels[value?.provider]}</p>
        {canRefund && !error && (
          <button
            className="text-slate-500 dark:text-slate-200 text-[14px] hover:text-slate-700 dark:hover:text-slate-300 text-left"
            onClick={handleRefund}
          >
            🔄 Вернуть
          </button>
        )}
      </div>
      <div className="flex flex-col gap-1 items-end">
        <p
          className={cn(
            'text-slate-500 dark:text-slate-200 font-bold text-[14px]',
            transactionStatusColors[value?.status],
          )}
        >
          {value?.amount} {transactionCurrencyLabels[value?.currency] || value?.currency}
        </p>
        {value?.comissionAmount && value?.comissionPercent && (
          <p className="text-red-500 dark:text-red-400 font-bold text-[14px]">
            Комиссия: {value?.comissionAmount}{' '}
            {value?.comissionCurrency
              ? transactionCurrencyLabels[value?.comissionCurrency] || value?.comissionCurrency
              : value?.comissionCurrency}
          </p>
        )}
        <p
          className={cn(
            'text-slate-500 dark:text-slate-200 font-medium text-[14px]',
            transactionStatusColors[value?.status],
          )}
        >
          {transactionStatusIcons[value?.status]} {transactionStatusLabels[value?.status]}
        </p>
        <p className="text-right text-slate-500 dark:text-slate-200 text-[14px]">
          {time(value?.createdAt).format('HH:mm')}
        </p>
      </div>
    </div>
  )
}
