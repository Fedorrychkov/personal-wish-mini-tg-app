import { useMutation, useQueryClient } from 'react-query'

import { ClientGamesApi, CreateGameRequest, GameResponse } from '~/entities/games'

export const useGameCreateMutation = (key?: string) => {
  const queryClient = useQueryClient()

  return useMutation(
    (body: CreateGameRequest) => {
      const api = new ClientGamesApi()

      return api.createGame(body)
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
