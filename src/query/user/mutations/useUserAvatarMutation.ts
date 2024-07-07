import { useMutation, useQueryClient } from 'react-query'

import { ClientUserApi, User } from '~/entities'

export const useUserAvatarMutation = (key?: string) => {
  const queryClient = useQueryClient()

  const upload = useMutation(
    (file: File) => {
      const body = new FormData()
      body.append('file', file)
      const api = new ClientUserApi()

      return api.uploadAvatar(body)
    },
    {
      onSuccess: (response) => {
        if (!key) return

        queryClient.setQueryData<User | undefined>(key || '', (data) => {
          return { ...data, ...response }
        })
      },
    },
  )

  const remove = useMutation(
    () => {
      const api = new ClientUserApi()

      return api.removeAvatar()
    },
    {
      onSuccess: () => {
        if (!key) return

        queryClient.setQueryData<User | undefined>(key || '', (data) => {
          return { id: '', ...data, avatarUrl: '' }
        })
      },
    },
  )

  return {
    upload,
    remove,
  }
}
