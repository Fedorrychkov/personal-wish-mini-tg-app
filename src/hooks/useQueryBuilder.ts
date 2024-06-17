import { useQuery, UseQueryOptions } from 'react-query'

export type QueryProps<TData = unknown, TError = unknown> = {
  key: string
  enabled: boolean
  method: () => Promise<TData>
  options?: Omit<UseQueryOptions<TData, TError, TData, string>, 'queryKey' | 'queryFn'>
}

export function useQueryBuilder<TData, TError>({ key, enabled, method, options }: QueryProps<TData, TError>) {
  const props = useQuery(key, method, {
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 3000,
    enabled,
    ...options,
  })

  return props
}
