import { useMutation, useQueryClient } from 'react-query'

import { ClientWishApi, Wish } from '~/entities/wish'

export const useUserWishBookMutation = (id: string, key?: string) => {
  const queryClient = useQueryClient()

  return useMutation(
    () => {
      const api = new ClientWishApi()

      return api.bookToggle(id)
    },
    {
      onSuccess: (data: Wish) => {
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
      },
    },
  )
}
