import { useMutation, useQueryClient } from 'react-query'

import { ClientWishApi, Wish, WishDto } from '~/entities/wish'

export const useUserWishCreateMutation = (key?: string) => {
  const queryClient = useQueryClient()

  return useMutation(
    (body: WishDto) => {
      const api = new ClientWishApi()

      return api.create(body)
    },
    {
      onSuccess: key
        ? (data: Wish) => {
            queryClient.setQueryData<Wish[] | Wish | undefined>(key || '', (forms = []) => {
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
