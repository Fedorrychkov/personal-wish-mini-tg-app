import { time } from '~/utils'

import { HistoryItem } from '../types'

export function usePrepareHistoryItems<T extends { id: string }>(
  data: T[] | undefined,
  groupDatetimeKey: keyof T,
  listKey: keyof T = 'id',
): HistoryItem<T>[] {
  if (!data) return []

  const groupedByDate = data.reduce((acc, item) => {
    const dateStr = item[groupDatetimeKey] as string
    const formattedDate = time(dateStr).format('YYYY-MM-DD')

    if (!acc.has(formattedDate)) {
      acc.set(formattedDate, [])
    }

    acc.get(formattedDate)?.push(item)

    return acc
  }, new Map<string, T[]>())

  // Преобразуем Map в массив с нужной структурой
  return Array.from(groupedByDate.entries())
    .map(([datetime, list]) => ({
      datetime,
      list: list.map((item, index) => ({ ...item, key: `${index}-${item?.[listKey]}` })),
    }))
    .sort((a, b) => b.datetime.localeCompare(a.datetime)) // Сортировка по убыванию даты
}
