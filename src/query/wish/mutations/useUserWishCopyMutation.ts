import { useMutation } from 'react-query'

import { ClientWishApi, Wish } from '~/entities/wish'

export const useUserWishCopyMutation = (id: string, onSuccess?: (data: Wish) => void) => {
  return useMutation(
    () => {
      const api = new ClientWishApi()

      return api.copyWish(id)
    },
    {
      onSuccess,
    },
  )
}
