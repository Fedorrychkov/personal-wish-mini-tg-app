import { Fragment } from 'react'

import { cn, formatHistoryDate } from '~/utils'

import { HistoryItem } from './types'

type Props<T> = {
  data: HistoryItem<T>[]
  ItemComponent: React.FC<{ value: T; className?: string }>
  className?: string
  historyGroupClassName?: string
  historyItemClassName?: string
}

export function HistoryContainer<T>(props: Props<T>) {
  const { data, ItemComponent, className, historyGroupClassName, historyItemClassName } = props

  return (
    <div className={cn('flex flex-col gap-4 w-full', className)}>
      {data.map((group, index) => (
        <Fragment key={group.datetime}>
          <div className={cn('flex flex-col gap-4', historyGroupClassName)}>
            <h3 className="font-medium">{formatHistoryDate(group.datetime)}</h3>
            <div className="flex flex-col gap-2">
              {group.list.map((item, index) => (
                <Fragment key={item.key}>
                  <ItemComponent key={index} value={item} className={cn('w-full', historyItemClassName)} />
                  {index !== group?.list?.length - 1 && (
                    <div className="h-[2px] w-full bg-slate-100 dark:bg-slate-200" />
                  )}
                </Fragment>
              ))}
            </div>
          </div>
          {index !== data.length - 1 && <div className="h-[2px] w-full bg-slate-100 dark:bg-slate-200" />}
        </Fragment>
      ))}
    </div>
  )
}
