import { useMutation, useQueryClient } from 'react-query'

import { ClientGamesApi, GameParticipant } from '~/entities/games'

export const useAcceptParticipantInvitationMutation = (gameId: string, key?: string) => {
  const queryClient = useQueryClient()

  return useMutation(
    () => {
      const api = new ClientGamesApi()

      return api.acceptGameInvitation(gameId)
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

              return items
            })
          }
        : undefined,
    },
  )
}
