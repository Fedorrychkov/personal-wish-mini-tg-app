import { UseQueryOptions } from 'react-query'

import { ClientGamesApi, GameResponse, GamesFilter } from '~/entities/games'
import { useQueryBuilder } from '~/hooks'

export const useGamesWhenIAmParticipantQuery = (
  userId: string,
  filter?: GamesFilter,
  enabled = true,
  options?: Omit<UseQueryOptions<GameResponse[], unknown, GameResponse[], string>, 'queryKey' | 'queryFn'> | undefined,
) => {
  const key = `games-by-participant-${userId}-${Object.values(filter || {})}`

  const props = useQueryBuilder({
    key,
    enabled,
    method: async () => {
      const api = new ClientGamesApi()
      const response = await api.getGamesWhenIAmParticipant(filter)

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
