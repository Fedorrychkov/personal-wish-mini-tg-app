import { Button, Chip, FormControlLabel, Switch } from '@mui/material'
import { AxiosError } from 'axios'
import { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Link, useLocation } from 'react-router-dom'

import { TextFieldContainer } from '~/components/fields'
import { NumberFormat } from '~/components/NumberFormat'
import { UserHeader } from '~/components/user'
import { TRANSACTION_DEPOSIT_COMISSION, TRANSACTION_DEPOSIT_COMISSION_NUMBER } from '~/constants'
import { TransactionBalanceItem, transactionCurrencyLabels, TransactionType } from '~/entities'
import { useRegister, useTgBack } from '~/hooks'
import { DefaultLayout } from '~/layouts/default'
import { useAuth, useNotifyContext } from '~/providers'
import { useTopupTransactionMutation, useTransactionUserBalanceQuery } from '~/query'
import { ROUTE } from '~/router'
import { NUMBER_ABSOLUTE_REGEXP, tgUtils } from '~/utils'

const amountChips = [10, 100, 1000, 3000, 5000]

export const DepositPage = () => {
  const { user } = useAuth()
  const [isSupport, setIsSupport] = useState(false)
  const location = useLocation()

  const { setNotify } = useNotifyContext()

  const { data: balance } = useTransactionUserBalanceQuery(!!user?.id)
  const topupTransactionMutation = useTopupTransactionMutation()

  const amountProps = location.state?.amount || 50

  useTgBack({
    defaultBackPath: location.state?.prevPage || ROUTE.home,
  })

  const form = useForm<TransactionBalanceItem>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      amount: amountProps ? amountProps.toString() : '50',
      currency: 'XTR',
    },
  })

  const { handleSubmit: onSubmit, formState, register, watch, setValue } = form
  const { errors } = formState

  const handleSubmit = useCallback(
    async (values: TransactionBalanceItem) => {
      try {
        const response = await topupTransactionMutation.mutateAsync({
          ...values,
          type: isSupport ? TransactionType.SUPPORT : TransactionType.USER_TOPUP,
        })

        const { invoiceLink } = response
        setNotify('Счет на оплату успешно создан', { severity: 'success' })

        tgUtils.openTelegramLink(invoiceLink)
      } catch (error) {
        let message = 'Ошибка при создании счета на оплату'

        if (error instanceof AxiosError) {
          message = error.response?.data?.message || message
        }

        setNotify(message, { severity: 'error' })

        console.error(error)
      }
    },
    [topupTransactionMutation, setNotify, isSupport],
  )

  const amountField = useRegister({
    ...register('amount', {
      required: {
        value: true,
        message: 'Сумма обязательна',
      },
      pattern: {
        value: NUMBER_ABSOLUTE_REGEXP,
        message: 'Не верный формат суммы, доступны только целые числа, примеры: 1, 10, 100, 1000',
      },
    }),
    errors,
    withRef: false,
  })

  const currencyField = useRegister({
    ...register('currency', {
      required: {
        value: true,
        message: 'Валюта обязательна',
      },
      pattern: {
        value: /XTR/gi,
        message: 'Доступные валюты: XTR',
      },
    }),
    errors,
    withRef: false,
  })

  const [amount, currency] = watch(['amount', 'currency'])

  const isLoading = topupTransactionMutation?.isLoading

  return (
    <DefaultLayout className="!px-0 !mb-6">
      <UserHeader className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4" editable={false} />
      <div className="flex flex-col gap-2">
        <div className="p-4 flex flex-col justify-start items-start">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">Пополнение баланса</h3>
          <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal">
            На данный момент, пополнение баланса доступно только в Telegram Stars {transactionCurrencyLabels['XTR']}{' '}
            Тикер - (XTR)
          </p>
        </div>

        <div className="flex flex-col gap-4 bg-white dark:bg-slate-600 rounded-lg mx-4">
          <div className="flex flex-col gap-2 justify-center items-center m-4">
            <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal">Ваш текущий баланс:</p>
            {balance?.length ? (
              <>
                {balance.map((item) => (
                  <p key={item.currency} className="text-slate-800 dark:text-slate-200 text-[14px] font-medium">
                    <NumberFormat value={item.amount} />{' '}
                    {item.currency ? transactionCurrencyLabels[item.currency] || item.currency : ''}
                  </p>
                ))}
              </>
            ) : (
              <p className="text-slate-600 dark:text-slate-200 text-[14px] font-medium text-center">
                Баланс пуст, для пополнения введите сумму и нажмите на кнопку "Оплатить"
              </p>
            )}
          </div>

          <FormProvider {...form}>
            <form
              className="p-4 pt-0 bg-slate-200/[.1] dark:bg-slate-900/[.1] flex flex-col gap-3"
              onSubmit={onSubmit(handleSubmit)}
            >
              <div className="flex flex-col gap-2">
                <TextFieldContainer
                  {...amountField}
                  className="w-full mt-4"
                  preventDisabled={isLoading}
                  placeholder="Сумма пополнения"
                  label="Сумма пополнения"
                  required
                />
                <div className="flex flex-wrap gap-4 my-2">
                  {amountChips.map((item) => (
                    <Chip
                      className="dark:!text-slate-200 dark:!bg-slate-600 !px-1 !py-[2px] !rounded-lg text-sm text-slate-900 dark:text-white"
                      key={item}
                      onClick={() =>
                        setValue('amount', (Number(amount || 0) + item).toString(), {
                          shouldTouch: true,
                          shouldDirty: true,
                        })
                      }
                      label={`${item} ${transactionCurrencyLabels['XTR']}`}
                    />
                  ))}
                </div>
              </div>
              <TextFieldContainer
                {...currencyField}
                className="w-full mt-4"
                placeholder="Валюта пополнения"
                label="Валюта пополнения"
                preventDisabled
                required
                disabled
              />
              <FormControlLabel
                className="w-full"
                control={
                  <>
                    <Switch
                      checked={isSupport}
                      value={isSupport}
                      disabled={isLoading || currency !== 'XTR'}
                      onChange={(_, checked) => setIsSupport(checked)}
                    />
                  </>
                }
                label={`Поддержка бота (средств не будут зачислены на баланс) ${isSupport ? '(Да)' : '(Нет)'}`}
              />
              <div className="flex flex-col gap-2 justify-center items-center">
                <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-center">
                  Обратите внимание, при пополнении баланса, сервис удерживает комиссию в размере{' '}
                  {TRANSACTION_DEPOSIT_COMISSION}% от суммы пополнения
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-center">
                  При возврате средств, возвращется полная стоимость пополнения
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-center">
                  При переводе средств, вы соглашаетесь с этими условиями и условиями использования сервиса
                </p>
              </div>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Оплатить <NumberFormat value={amount || 0} />{' '}
                {currency ? transactionCurrencyLabels[currency] || currency : ''}
              </Button>
              {!isSupport && (
                <div className="flex flex-col gap-2 justify-center items-center">
                  <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-center">
                    На баланс будет зачислено{' '}
                    <NumberFormat
                      value={Number(amount || 0) - Number(amount || 0) * TRANSACTION_DEPOSIT_COMISSION_NUMBER}
                    />{' '}
                    {currency ? transactionCurrencyLabels[currency] || currency : ''}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-center">
                    Этот перевод можно отменить в течении 21 дня, но если на вашем внутреннем балансе не достаточно
                    средств, перевод не удасться отменить
                  </p>
                </div>
              )}
            </form>
          </FormProvider>
        </div>

        <div className="flex flex-col gap-2 justify-center items-center">
          <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-center">
            Все транзакции доступны в Истории транзакций
          </p>

          <Link
            to={ROUTE.transaction}
            state={{ prevPage: ROUTE.deposit }}
            className="text-blue-500 dark:text-blue-400 text-[14px] font-normal text-center"
          >
            Открыть историю транзакций
          </Link>
        </div>
      </div>
    </DefaultLayout>
  )
}
