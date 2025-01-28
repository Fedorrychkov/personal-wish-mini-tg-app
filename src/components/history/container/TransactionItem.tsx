import { AxiosError } from 'axios'
import { useCallback, useMemo } from 'react'
import { useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'

import { NumberFormat } from '~/components/NumberFormat'
import {
  Transaction,
  transactionCurrencyLabels,
  TransactionPayload,
  TransactionPayloadType,
  transactionProviderLabels,
  transactionStatusColors,
  transactionStatusIcons,
  transactionStatusLabels,
  TransactionType,
  transactionTypeColors,
  transactionTypeIcons,
  transactionTypeLabels,
} from '~/entities'
import { getErrorMessageByCode } from '~/errors'
import { useNotifyContext } from '~/providers'
import { useRefundTransactionMutation, useTransactionCanRefundQuery } from '~/query'
import { ROUTE } from '~/router'
import { cn, convertTextToShort, jsonParse, time, truncate } from '~/utils'

import { TransactionUserItem } from './TransactionUserItem'

type Props = {
  value: Transaction
  className?: string
}

export const TransactionItem = (props: Props) => {
  const { setNotify } = useNotifyContext()

  const { value, className } = props

  const key = `transaction-can-refund-${value?.id}`
  const queryData = useQueryClient().getQueryState(key)
  const hasData = !!queryData?.data || !!queryData?.error
  const { data: canRefund, error, refetch } = useTransactionCanRefundQuery(value?.id, key, !!value?.id && !hasData)

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

  const transactionPayload = useMemo(() => {
    if (!value?.payload) return null

    const payload = jsonParse<TransactionPayload>(value?.payload)

    return payload || null
  }, [value])

  return (
    <div className={cn('w-full flex flex-col gap-2 items-start justify-between w-full', className)}>
      <div className="flex flex-row gap-4 items-start justify-between w-full">
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
          {transactionPayload && (
            <div className="text-slate-500 dark:text-slate-200 text-[14px]">
              {!transactionPayload?.isAnonymous &&
                transactionPayload?.type === TransactionPayloadType.TRANSFER &&
                transactionPayload?.userId && (
                  <Link
                    to={ROUTE.userWishList?.replace(':id', transactionPayload?.userId || '')}
                    state={{ prevPage: ROUTE.transaction }}
                    className="flex flex-row gap-2 items-center text-blue-600 dark:text-blue-500"
                  >
                    {value?.type === TransactionType.USER_WITHDRAW && <span>Перевод</span>}
                    {value?.type === TransactionType.USER_TOPUP && <span>Пополнение</span>}
                    <TransactionUserItem userId={transactionPayload?.userId} showMeta={false} />
                  </Link>
                )}
              {!transactionPayload?.isAnonymous &&
                transactionPayload?.type === TransactionPayloadType.SHOW_WISH_BOOKED_USER &&
                value?.wishId && (
                  <Link
                    to={ROUTE.wish?.replace(':id', value?.wishId || '')}
                    state={{ prevPage: ROUTE.transaction }}
                    className="flex flex-row gap-2 items-center text-blue-600 dark:text-blue-500"
                  >
                    <span>Открыть желание</span>
                  </Link>
                )}
              {!transactionPayload?.isAnonymous &&
                transactionPayload?.type === TransactionPayloadType.SHOW_SECRET_SANTA_USER &&
                value?.santaGameId && (
                  <Link
                    to={ROUTE.gameById?.replace(':id', value?.santaGameId || '')}
                    state={{ prevPage: ROUTE.transaction }}
                    className="flex flex-row gap-2 items-center text-blue-600 dark:text-blue-500"
                  >
                    <span>Открыть секретного Санту</span>
                  </Link>
                )}
              {!transactionPayload?.isAnonymous &&
                transactionPayload?.type === TransactionPayloadType.INVITED_NEW_USER &&
                transactionPayload?.userId && (
                  <Link
                    to={ROUTE.userWishList?.replace(':id', transactionPayload?.userId || '')}
                    state={{ prevPage: ROUTE.transaction }}
                    className="flex flex-row gap-2 items-center text-blue-600 dark:text-blue-500"
                  >
                    <span>Вы пригласили</span>
                    <TransactionUserItem userId={transactionPayload?.userId} />
                  </Link>
                )}
              {!transactionPayload?.isAnonymous &&
                transactionPayload?.type === TransactionPayloadType.INVITEE_BONUS &&
                transactionPayload?.userId && (
                  <Link
                    to={ROUTE.userWishList?.replace(':id', transactionPayload?.userId || '')}
                    state={{ prevPage: ROUTE.transaction }}
                    className="flex flex-row gap-2 items-center text-blue-600 dark:text-blue-500"
                  >
                    <span>Вас пригласил</span>
                    <TransactionUserItem userId={transactionPayload?.userId} />
                  </Link>
                )}
              {!transactionPayload?.isAnonymous &&
                transactionPayload?.type === TransactionPayloadType.REFFERAL_BONUS &&
                transactionPayload?.userId && (
                  <Link
                    to={ROUTE.userWishList?.replace(':id', transactionPayload?.userId || '')}
                    state={{ prevPage: ROUTE.transaction }}
                    className="flex flex-row gap-2 items-center text-blue-600 dark:text-blue-500"
                  >
                    <span>{transactionPayload.message}</span>
                    <TransactionUserItem userId={transactionPayload?.userId} />
                  </Link>
                )}
            </div>
          )}
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
            <NumberFormat value={value?.amount || 0} /> {transactionCurrencyLabels[value?.currency] || value?.currency}
          </p>
          {value?.comissionAmount && value?.comissionPercent && (
            <p className="text-red-500 dark:text-red-400 font-bold text-[14px]">
              Комиссия: <NumberFormat value={value?.comissionAmount} />{' '}
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
      {transactionPayload &&
        value?.type === TransactionType.REFFERAL &&
        transactionPayload.type === TransactionPayloadType.REFFERAL_BONUS &&
        value?.refundExpiredAt && (
          <div>
            <p className="text-slate-500 dark:text-slate-200 text-[14px]">
              Станет доступно на балансе {time(value?.refundExpiredAt).format('D MMMM, YYYY HH:mm')}
            </p>
          </div>
        )}
      {transactionPayload &&
      value?.type === TransactionType.USER_WITHDRAW &&
      transactionPayload.type === TransactionPayloadType.WITHDRAWAL_TO_EXTERNAL_WALLET ? (
        <>
          {transactionPayload.message && (
            <div>
              <p className="text-slate-500 dark:text-slate-200 text-[10px]">{transactionPayload.message}</p>
            </div>
          )}
          {transactionPayload.addressScanUrl && transactionPayload.targetWalletAddress && (
            <div>
              <a
                target="_blank"
                href={transactionPayload.addressScanUrl}
                className="text-blue-500 dark:text-blue-200 text-[14px]"
              >
                Получатель: {convertTextToShort(transactionPayload.targetWalletAddress)}
              </a>
            </div>
          )}
          {transactionPayload.txScanUrl && value?.providerInvoiceId && (
            <div>
              <a
                target="_blank"
                href={transactionPayload.txScanUrl}
                className="text-blue-500 dark:text-blue-200 text-[14px]"
              >
                Транзакция: {convertTextToShort(value?.providerInvoiceId)}
              </a>
            </div>
          )}
          {transactionPayload.serviceFee && transactionPayload.conversionCurrency && (
            <div>
              <p className="text-slate-500 dark:text-slate-200 text-[14px]">
                Комиссия сервиса: {truncate(transactionPayload.serviceFee, 4)}{' '}
                {transactionCurrencyLabels[transactionPayload.conversionCurrency || '']} (
                {transactionPayload.conversionCurrency})
              </p>
            </div>
          )}
          {transactionPayload.finalAmountToGet?.amount && transactionPayload.finalAmountToGet?.currency && (
            <div>
              <p className="text-slate-500 dark:text-slate-200 text-[14px]">
                Сумма к получению: {truncate(transactionPayload.finalAmountToGet?.amount, 4)}{' '}
                {transactionCurrencyLabels[transactionPayload.finalAmountToGet?.currency || '']} (
                {transactionPayload.finalAmountToGet?.currency})
              </p>
            </div>
          )}
        </>
      ) : null}
      {transactionPayload &&
      [TransactionType.USER_WITHDRAW].includes(value?.type) &&
      transactionPayload.type === TransactionPayloadType.CONVERT_BALANCE ? (
        <>
          {transactionPayload?.conversionRate &&
            transactionPayload?.conversionRate?.amount &&
            transactionPayload?.conversionRate?.rate && (
              <div>
                <p className="text-slate-500 dark:text-slate-200 text-[14px]">
                  Конвертация баланса: {truncate(value?.amount, 4)}{' '}
                  {transactionCurrencyLabels[transactionPayload.conversionRate.fromCurrency || '']} (
                  {transactionPayload.conversionRate.fromCurrency}) {'=>'}{' '}
                  {truncate(transactionPayload.conversionRate.amount, 4)}{' '}
                  {transactionCurrencyLabels[transactionPayload.conversionRate.toCurrency || '']} (
                  {transactionPayload.conversionRate.toCurrency})
                </p>
                <p className="text-slate-500 dark:text-slate-200 text-[14px]">
                  Курс: {truncate(transactionPayload.conversionRate.rate, 4)}{' '}
                  {transactionCurrencyLabels[transactionPayload.conversionRate.fromCurrency || '']} (
                  {transactionPayload.conversionRate.fromCurrency})
                </p>
              </div>
            )}
        </>
      ) : null}
    </div>
  )
}
