import { useMutation, useQueryClient } from 'react-query'

import { ClientWishApi, Wish } from '~/entities/wish'

export const useUserWishDeleteMutation = (id: string, key?: string) => {
  const queryClient = useQueryClient()

  return useMutation(
    () => {
      const api = new ClientWishApi()

      return api.delete(id)
    },
    {
      onSuccess: () => {
        queryClient.setQueryData<Wish[] | undefined>(key || '', (forms = []) => {
          const items = forms?.filter((item) => item.id !== id)

          return items
        })
      },
    },
  )
}
