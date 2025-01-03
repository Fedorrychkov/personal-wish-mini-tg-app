import { useMutation, useQueryClient } from 'react-query'

import { ClientGamesApi, GameParticipant } from '~/entities/games'

export const useInviteParticipantMutation = (gameId: string, key?: string) => {
  const queryClient = useQueryClient()

  return useMutation(
    (userId: string) => {
      const api = new ClientGamesApi()

      return api.shareGameWithParticipant(gameId, userId)
    },
    {
      onSuccess: key
        ? (data: GameParticipant) => {
            queryClient.setQueryData<GameParticipant[] | GameParticipant | undefined>(key || '', (forms = []) => {
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
