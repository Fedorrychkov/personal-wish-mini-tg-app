import { Avatar, Button, Chip, FormControlLabel, Switch } from '@mui/material'
import { AxiosError } from 'axios'
import { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { AutocompleteFieldContainer, TextFieldContainer } from '~/components/fields'
import { NumberFormat } from '~/components/NumberFormat'
import { UserHeader } from '~/components/user'
import { TRANSACTION_WITHDRAW_COMISSION, TRANSACTION_WITHDRAW_COMISSION_NUMBER } from '~/constants'
import { BalanceTransfer, transactionCurrencyLabels } from '~/entities'
import { useRegister, useTgBack } from '~/hooks'
import { DefaultLayout } from '~/layouts/default'
import { useAuth, useNotifyContext } from '~/providers'
import { useTransactionUserBalanceQuery, useTransferTransactionMutation, useUserDataQuery } from '~/query'
import { ROUTE } from '~/router'
import { AnyCurrency } from '~/types'
import { NUMBER_REGEXP_WITH_DOT } from '~/utils'

const amountChips: Record<AnyCurrency, number[]> = {
  XTR: [10, 100, 1000, 3000, 5000],
  TON: [0.05, 0.1, 0.5, 1, 5],
}

export const TransferPage = () => {
  const { user } = useAuth()
  const { userId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [isAnonymous, setIsAnonymous] = useState(false)

  const { data: targetUser } = useUserDataQuery(userId || '', userId || '', !!userId)

  const prevRoute = location.state?.prevPage || ROUTE.home

  const { setNotify } = useNotifyContext()

  const { data: balance } = useTransactionUserBalanceQuery(!!user?.id)
  const transferTransactionMutation = useTransferTransactionMutation()

  const balanceCurrencies = balance?.map((item) => item.currency)

  useTgBack({
    defaultBackPath: prevRoute,
  })

  const form = useForm<BalanceTransfer>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      amount: '10',
      currency: 'XTR',
      targetUserId: userId,
    },
  })

  const { handleSubmit: onSubmit, formState, register, watch, setValue } = form
  const { errors } = formState

  const handleSubmit = useCallback(
    async (values: BalanceTransfer) => {
      try {
        await transferTransactionMutation.mutateAsync({
          ...values,
          isAnonymous,
        })

        setNotify(
          'Внутренний перевод успешно выполнен, транзакция появится в истории транзакций, вы автоматически будете перенаправлены через 5 секунд',
          {
            severity: 'success',
          },
        )

        setTimeout(() => {
          navigate(ROUTE.transaction)
        }, 5000)
      } catch (error) {
        let message = 'Ошибка при переводе средств, попробуйте позже или обратитесь в поддержку'

        if (error instanceof AxiosError) {
          message = error.response?.data?.message || message
        }

        setNotify(message, { severity: 'error' })

        console.error(error)
      }
    },
    [transferTransactionMutation, setNotify, navigate, isAnonymous],
  )

  const amountField = useRegister({
    ...register('amount', {
      required: {
        value: true,
        message: 'Сумма обязательна',
      },
      pattern: {
        value: NUMBER_REGEXP_WITH_DOT,
        message: 'Не верный формат суммы, пример корректного формата: 1, 1.1, 0.002',
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
        value: new RegExp(`^(${balanceCurrencies?.join('|')})$`),
        message: `Доступные валюты: ${balanceCurrencies?.join(', ')}`,
      },
    }),
    errors,
    withRef: false,
  })

  const [amount, currency] = watch(['amount', 'currency'])

  const isLoading = transferTransactionMutation?.isLoading

  const handleOpenUser = () => {
    navigate(ROUTE.userWishList?.replace(':id', userId || ''), {
      state: { prevPage: ROUTE.transferToUser?.replace(':userId', userId || '') },
    })
  }

  return (
    <DefaultLayout className="!px-0 !mb-6">
      <UserHeader className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4" editable={false} />
      <div className="flex flex-col gap-2">
        <div className="p-4 flex flex-col justify-start items-start">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">Внутренний перевод</h3>
          <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal">
            Перевод доступен в валюте баланса пользователя, на данный момент доступен в Telegram Stars{' '}
            {transactionCurrencyLabels['XTR']} Тикер - (XTR) и TON {transactionCurrencyLabels['TON']} Тикер - (TON)
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
                Баланс пуст, для перевода пополните баланс
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
                  placeholder="Сумма перевода"
                  label="Сумма перевода"
                  required
                />
                <div className="flex flex-wrap gap-4 my-2">
                  {amountChips?.[currency]?.map((item) => (
                    <Chip
                      className="dark:!text-slate-200 dark:!bg-slate-600 !px-1 !py-[2px] !rounded-lg text-sm text-slate-900 dark:text-white"
                      key={item}
                      onClick={() =>
                        setValue('amount', (Number(amount || 0) + item).toString(), {
                          shouldTouch: true,
                          shouldDirty: true,
                        })
                      }
                      label={`${item} ${transactionCurrencyLabels[currency]}`}
                    />
                  ))}
                </div>
              </div>
              <AutocompleteFieldContainer
                {...currencyField}
                options={balanceCurrencies?.map((item) => ({ inputValue: item || '', title: item || '' })) || []}
                disabled={isLoading || !balanceCurrencies?.length}
                realValue={currency}
                fullWidth
                isLoading={isLoading}
                label="Валюта перевода"
                noOptionsText="Нет доступных валют баланса"
              />
              <div className="flex flex-col gap-1">
                <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-left mx-4">
                  Вы переводите средства пользователю:
                </p>
                <div
                  className="flex flex-row gap-4 justify-start items-center border-[1px] border-slate-200 dark:border-slate-200 rounded-lg p-[2px] cursor-pointer hover:opacity-80"
                  onClick={handleOpenUser}
                >
                  <Avatar
                    alt={targetUser?.username || targetUser?.firstName || targetUser?.lastName || targetUser?.id}
                    src={targetUser?.avatarUrl || ''}
                  />
                  <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-left">
                    {targetUser?.username || targetUser?.firstName || targetUser?.lastName || targetUser?.id}
                  </p>
                </div>
              </div>
              <FormControlLabel
                className="w-full"
                control={
                  <>
                    <Switch
                      checked={isAnonymous}
                      value={isAnonymous}
                      disabled={isLoading}
                      onChange={(_, checked) => setIsAnonymous(checked)}
                    />
                  </>
                }
                label={`Анонимный перевод ${isAnonymous ? '(Да)' : '(Нет)'}`}
              />
              <div className="flex flex-col gap-2 justify-center items-center">
                <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-center">
                  Обратите внимание, при переводе средств, сервис удерживает комиссию в размере{' '}
                  {TRANSACTION_WITHDRAW_COMISSION}% от суммы перевода
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-center">
                  Внутренний перевод не поддерживает возврат средств
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-center">
                  При переводе средств, вы соглашаетесь с этими условиями и условиями использования сервиса
                </p>
              </div>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Перевести <NumberFormat value={amount || 0} />{' '}
                {currency ? transactionCurrencyLabels[currency] || currency : ''}
              </Button>
              <div className="flex flex-col gap-2 justify-center items-center">
                <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-center">
                  Вы переведете пользователю{' '}
                  <NumberFormat
                    value={Number(amount || 0) - Number(amount || 0) * TRANSACTION_WITHDRAW_COMISSION_NUMBER}
                  />{' '}
                  {currency ? transactionCurrencyLabels[currency] || currency : ''} эту операцию невозможно отменить
                </p>
              </div>
            </form>
          </FormProvider>
        </div>

        <div className="flex flex-col gap-2 justify-center items-center">
          <p className="text-slate-500 dark:text-slate-400 text-[14px] font-normal text-center">
            Все транзакции доступны в Истории транзакций
          </p>

          <Link
            to={ROUTE.transaction}
            state={{ prevPage: ROUTE.transferToUser?.replace(':userId', userId || '') }}
            className="text-blue-500 dark:text-blue-400 text-[14px] font-normal text-center"
          >
            Открыть историю транзакций
          </Link>
        </div>
      </div>
    </DefaultLayout>
  )
}
