import { UseQueryOptions } from 'react-query'

import { ClientGamesApi, GameParticipant } from '~/entities/games'
import { useQueryBuilder } from '~/hooks'

export const useMyParticipantQuery = (
  gameId: string,
  enabled = true,
  options?:
    | Omit<UseQueryOptions<GameParticipant, unknown, GameParticipant, string>, 'queryKey' | 'queryFn'>
    | undefined,
) => {
  const key = `game-my-participant-${gameId}`

  const props = useQueryBuilder({
    key,
    enabled,
    method: async () => {
      const api = new ClientGamesApi()
      const response = await api.getGameMyParticipant(gameId)

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
