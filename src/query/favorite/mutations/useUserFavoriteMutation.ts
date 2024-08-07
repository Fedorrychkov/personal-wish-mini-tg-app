import { useMutation, useQueryClient } from 'react-query'

import { ClientFavoriteApi, Favorite, FavoriteDto } from '~/entities'

export const useUserFavoriteMutation = (key?: string) => {
  const queryClient = useQueryClient()

  return useMutation(
    (body: FavoriteDto) => {
      const api = new ClientFavoriteApi()

      return api.create(body)
    },
    {
      onSuccess: key
        ? (data: Favorite) => {
            queryClient.setQueryData<Favorite[] | Favorite | undefined>(key || '', (forms) => {
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
