import { useMutation, useQueryClient } from 'react-query'

import { ClientWishApi, Wish } from '~/entities/wish'

export const useUserWishGivenMutation = (id: string, key?: string) => {
  const queryClient = useQueryClient()

  return useMutation(
    () => {
      const api = new ClientWishApi()

      return api.givenToggle(id)
    },
    {
      onSuccess: (data: Wish) => {
        queryClient.setQueryData<Wish[] | Wish | undefined>(key || '', (forms = []) => {
          if (!Array.isArray(forms)) {
            return data
          }

          const items = forms?.filter((item) => item.id !== data?.id)

          return items
        })
      },
    },
  )
}
