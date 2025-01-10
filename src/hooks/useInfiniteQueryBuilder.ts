import { QueryFunction, useInfiniteQuery, UseInfiniteQueryOptions } from 'react-query'

export type InfiniteQueryProps<TData = unknown, TError = unknown> = {
  key: string
  enabled: boolean
  method: QueryFunction<TData, string>
  options?: Omit<UseInfiniteQueryOptions<TData, TError, TData, TData, string>, 'queryKey' | 'queryFn'>
}

export function useInfiniteQueryBuilder<TData, TError>({
  key,
  enabled,
  method,
  options,
}: InfiniteQueryProps<TData, TError>) {
  const props = useInfiniteQuery(key, method, {
    retry: 1,
    retryDelay: 3000,
    enabled,
    refetchOnWindowFocus: false,
    ...options,
  })

  return props
}
