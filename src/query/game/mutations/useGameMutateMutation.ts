import { useMutation, useQueryClient } from 'react-query'

import { ClientGamesApi, GameResponse, MutateGameRequest } from '~/entities/games'

export const useGameMutateMutation = (gameId: string, key?: string) => {
  const queryClient = useQueryClient()

  return useMutation(
    (body: MutateGameRequest) => {
      const api = new ClientGamesApi()

      return api.mutateGame(gameId, body)
    },
    {
      onSuccess: key
        ? (data: GameResponse) => {
            queryClient.setQueryData<GameResponse[] | GameResponse | undefined>(key || '', (forms = []) => {
              if (!Array.isArray(forms)) {
                return data
              }

              const items = forms?.map((item) => {
                if (item.id === data?.id) {
                  return data
                }

                return item
              })

              items.unshift(data)

              return items
            })
          }
        : undefined,
    },
  )
}
