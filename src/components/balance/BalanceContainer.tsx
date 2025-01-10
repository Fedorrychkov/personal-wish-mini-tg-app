import { transactionCurrencyLabels } from '~/entities'
import { ONBOARDING_DATA_NAME, useAuth } from '~/providers'
import { useTransactionUserBalanceQuery } from '~/query'
import { cn } from '~/utils'

import { NumberFormat } from '../NumberFormat'
import { useBalanceButtons } from './hooks'

type Props = {
  className?: string
}

export const BalanceContainer = ({ className }: Props) => {
  const { user } = useAuth()

  const { data: balance } = useTransactionUserBalanceQuery(!!user?.id)

  const { actionButtons } = useBalanceButtons()

  return (
    <div className={cn('w-full flex gap-4 items-start justify-between w-full', className)}>
      <div className="flex flex-col gap-1" data-tour={ONBOARDING_DATA_NAME.userBalance}>
        <p className="text-slate-800 dark:text-slate-200 text-[14px] font-bold">Баланс</p>
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
          <p className="text-slate-800 dark:text-slate-200 text-[14px] font-medium">Пусто</p>
        )}
      </div>
      {actionButtons}
    </div>
  )
}
