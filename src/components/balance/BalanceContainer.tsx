import { Button } from '@mui/material'
import { initPopup } from '@tma.js/sdk'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { DepositEmoji, TransactionsEmoji, WithdrawEmoji } from '~/assets/emoji'
import { transactionCurrencyLabels } from '~/entities'
import { useAuth } from '~/providers'
import { useTransactionUserBalanceQuery } from '~/query'
import { ROUTE } from '~/router'
import { cn } from '~/utils'

type Props = {
  className?: string
}

export const BalanceContainer = ({ className }: Props) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const popup = initPopup()

  const { data: balance } = useTransactionUserBalanceQuery(!!user?.id)

  const buttons = useMemo(() => {
    const buttons = [
      {
        icon: <DepositEmoji />,
        label: 'Пополнить',
        onClick: () => navigate(ROUTE.deposit),
      },
      {
        icon: <WithdrawEmoji />,
        label: 'Вывести',
        onClick: () => {
          popup
            .open({
              title: 'Выводы не доступны',
              message:
                'На данный момент функционал выводов не доступен, но вы всегда можете сделать вывод путем возврата средств со страницы Истории транзакций',
              buttons: [
                {
                  id: 'ok',
                  type: 'default',
                  text: location.pathname !== ROUTE.transaction ? 'Транзакции' : 'Закрыть',
                },
                { id: 'cancel', type: 'destructive', text: 'Понял' },
              ],
            })
            .then((buttonId) => {
              if ((!buttonId || buttonId === 'cancel') && location.pathname === ROUTE.transaction) {
                return
              }

              setTimeout(() => navigate(ROUTE.transaction), 500)
            })
        },
      },
    ]

    if (location.pathname !== ROUTE.transaction) {
      buttons.push({
        icon: <TransactionsEmoji />,
        label: 'Транзакции',
        onClick: () => navigate(ROUTE.transaction),
      })
    }

    return buttons
  }, [navigate, popup, location.pathname])

  return (
    <div className={cn('w-full flex gap-4 items-start justify-between w-full', className)}>
      <div className="flex flex-col gap-1">
        <p className="text-slate-800 dark:text-slate-200 text-[14px] font-bold">Баланс</p>
        {balance?.length ? (
          <>
            {balance.map((item) => (
              <p key={item.currency} className="text-slate-800 dark:text-slate-200 text-[14px] font-medium">
                {item.amount} {item.currency ? transactionCurrencyLabels[item.currency] || item.currency : ''}
              </p>
            ))}
          </>
        ) : (
          <p className="text-slate-800 dark:text-slate-200 text-[14px] font-medium">Пусто</p>
        )}
      </div>
      {buttons.map((button) => (
        <Button
          key={button.label}
          color="primary"
          size="small"
          variant="text"
          onClick={button.onClick}
          className="flex flex-col items-center justify-center bg-slate-300 dark:bg-slate-700 rounded-lg p-2"
        >
          <div className="inline-block transform">{button.icon}</div>
          <span className="text-slate-800 dark:text-slate-200 text-[12px] font-bold">{button.label}</span>
        </Button>
      ))}
    </div>
  )
}
