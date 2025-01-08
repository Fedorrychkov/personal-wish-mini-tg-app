import 'dayjs/locale/ru'

import dayjs from 'dayjs'

dayjs.locale('ru')

export const time = dayjs

export const formatHistoryDate = (dateStr: string) => {
  const date = time(dateStr)
  const now = time()

  if (date.isSame(now, 'day')) return 'Сегодня'

  if (date.isSame(now.subtract(1, 'day'), 'day')) return 'Вчера'

  if (date.isSame(now, 'year')) return date.format('D MMMM')

  return date.format('D MMMM, YYYY')
}
