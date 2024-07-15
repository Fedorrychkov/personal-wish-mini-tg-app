import { useMutation, useQueryClient } from 'react-query'

import { ClientFavoriteApi, Favorite } from '~/entities'

export const useUserFavoriteDeleteMutation = (favoriteUserId: string, key?: string) => {
  const queryClient = useQueryClient()

  return useMutation(
    () => {
      const api = new ClientFavoriteApi()

      return api.delete(favoriteUserId)
    },
    {
      onSuccess: key
        ? () => {
            queryClient.setQueryData<Favorite[] | Favorite | undefined>(key || '', (forms) => {
              if (!Array.isArray(forms)) {
                return undefined
              }

              const items = forms?.filter((item) => {
                if (item.favoriteUserId === favoriteUserId) {
                  return false
                }

                return true
              })

              return items
            })
          }
        : undefined,
    },
  )
}
