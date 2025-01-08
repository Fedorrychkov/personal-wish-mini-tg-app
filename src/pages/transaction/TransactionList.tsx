import { BalanceContainer } from '~/components/balance'
import { GroupedSkeleton, HistoryContainer, TransactionItem, usePrepareHistoryItems } from '~/components/history'
import { UserHeader } from '~/components/user'
import { useTgBack } from '~/hooks'
import { DefaultLayout } from '~/layouts/default'
import { useAuth } from '~/providers'
import { useTransactionListQuery } from '~/query'
import { ROUTE } from '~/router'

export const TransactionList = () => {
  const { user } = useAuth()
  const { data: transactions, isLoading: isLoadingTransactions } = useTransactionListQuery(!!user?.id)

  useTgBack({
    defaultBackPath: ROUTE.home,
  })

  const historyItems = usePrepareHistoryItems(transactions, 'createdAt', 'id')

  return (
    <DefaultLayout className="!px-0">
      <div className="flex flex-col flex-1 min-h-[100vh]">
        <UserHeader className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4" editable={false} />
        <div className="flex flex-col gap-2 flex-1">
          <div className="p-4 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">История транзакций</h3>
          </div>
          <BalanceContainer className="px-4 !justify-center" />
          <div className="flex flex-col flex-1 gap-4 bg-white dark:bg-slate-600 rounded-lg">
            {!transactions?.length && isLoadingTransactions && <GroupedSkeleton />}
            {!transactions?.length && !isLoadingTransactions && (
              <p className="text-center text-gray-500 dark:text-gray-200">У вас пока нет ни одной транзакции</p>
            )}
            <HistoryContainer
              data={historyItems}
              ItemComponent={TransactionItem}
              className="!gap-5"
              historyGroupClassName="p-4"
              historyItemClassName="!gap-1"
            />
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}
