import { UseQueryOptions } from 'react-query'

import { ClientGamesApi, GameResponse } from '~/entities/games'
import { useQueryBuilder } from '~/hooks'

export const useGameQuery = (
  id: string,
  enabled = true,
  options?: Omit<UseQueryOptions<GameResponse, unknown, GameResponse, string>, 'queryKey' | 'queryFn'> | undefined,
) => {
  const key = `game-${id}`

  const props = useQueryBuilder({
    key,
    enabled,
    method: async () => {
      const api = new ClientGamesApi()
      const response = await api.getGame(id)

      return response
    },
    options: {
      retry: 0,
      ...options,
    },
  })

  return {
    ...props,
    key,
  }
}
