import { Button } from '@mui/material'
import { initPopup } from '@tma.js/sdk'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { DepositEmoji, TransactionsEmoji, WithdrawEmoji } from '~/assets/emoji'
import { ONBOARDING_DATA_NAME } from '~/providers'
import { ROUTE } from '~/router'

export const useBalanceButtons = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const popup = initPopup()

  const buttons = useMemo(() => {
    const buttons = [
      {
        icon: <DepositEmoji />,
        label: 'Пополнить',
        dataTour: ONBOARDING_DATA_NAME.userTopup,
        onClick: () => navigate(ROUTE.deposit, { state: { prevPage: location.pathname } }),
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
              if (!buttonId || buttonId === 'cancel' || location.pathname === ROUTE.transaction) {
                return
              }

              setTimeout(() => navigate(ROUTE.transaction, { state: { prevPage: location.pathname } }), 500)
            })
        },
      },
    ]

    if (location.pathname !== ROUTE.transaction) {
      buttons.push({
        icon: <TransactionsEmoji />,
        label: 'Транзакции',
        dataTour: ONBOARDING_DATA_NAME.userTransactions,
        onClick: () => navigate(ROUTE.transaction, { state: { prevPage: location.pathname } }),
      })
    }

    return buttons
  }, [navigate, popup, location.pathname])

  const actionButtons = useMemo(
    () => (
      <>
        {buttons.map((button) => (
          <Button
            key={button.label}
            color="primary"
            size="small"
            variant="text"
            data-tour={button.dataTour}
            onClick={button.onClick}
            className="flex flex-col items-center justify-center bg-slate-300 dark:bg-slate-700 rounded-lg p-2"
          >
            <div className="inline-block transform">{button.icon}</div>
            <span className="text-slate-800 dark:text-slate-200 text-[12px] font-bold">{button.label}</span>
          </Button>
        ))}
      </>
    ),
    [buttons],
  )

  return { buttons, actionButtons }
}
