import { Chip } from '@mui/material'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { transactionCurrencyLabels } from '~/entities'
import { ONBOARDING_DATA_NAME, useAuth } from '~/providers'
import { useTransactionUserBalanceQuery } from '~/query'
import { ROUTE } from '~/router'
import { cn } from '~/utils'

import { NumberFormat } from '../NumberFormat'

type Props = {
  className?: string
  chipClassName?: string
}

export const WalletContainer = ({ className, chipClassName }: Props) => {
  const navigate = useNavigate()

  const { user } = useAuth()
  const { data: balance } = useTransactionUserBalanceQuery(!!user?.id)

  const balanceLabel = useMemo(() => {
    const xtrBalance = balance?.find((item) => item.currency === 'XTR')

    return `${xtrBalance?.amount || 0}`
  }, [balance])

  return (
    <div className={cn('flex gap-2', className)}>
      <Chip
        className={cn('!p-0 !rounded-lg text-sm !text-slate-200 !bg-blue-600', chipClassName)}
        data-tour={ONBOARDING_DATA_NAME.wallet}
        onClick={() => navigate(ROUTE.wallet, { state: { prevPage: location.pathname } })}
        label={
          <>
            💰 Кошелек <NumberFormat value={balanceLabel} /> {transactionCurrencyLabels['XTR']}
          </>
        }
      />
    </div>
  )
}
