import { useMutation, useQueryClient } from 'react-query'

import { ClientWishApi, Wish } from '~/entities/wish'

export const useUserWishImageMutation = (key?: string) => {
  const queryClient = useQueryClient()

  const upload = useMutation(
    ({ id, file }: { id: string; file: File }) => {
      const body = new FormData()
      body.append('file', file)
      const api = new ClientWishApi()

      return api.uploadImage(id, body)
    },
    {
      onSuccess: (response) => {
        if (!key) return

        queryClient.setQueryData<Wish | undefined>(key || '', (data) => {
          return { ...data, ...response }
        })
      },
    },
  )

  const remove = useMutation(
    (id: string) => {
      const api = new ClientWishApi()

      return api.removeImage(id)
    },
    {
      onSuccess: () => {
        if (!key) return

        queryClient.setQueryData<Wish | undefined>(key || '', (data) => {
          return { id: '', userId: '', name: '', ...data, imageUrl: '' }
        })
      },
    },
  )

  return {
    upload,
    remove,
  }
}
