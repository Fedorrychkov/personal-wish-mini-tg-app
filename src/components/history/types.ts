export type HistoryItem<T> = {
  datetime: string
  list: (T & { key: string })[]
}
