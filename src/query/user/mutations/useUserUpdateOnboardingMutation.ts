import { useMutation, useQueryClient } from 'react-query'

import { ClientUserApi, User, UserDto } from '~/entities'

export const useUserUpdateOnboardingMutation = (definedKey: string) => {
  const queryClient = useQueryClient()

  const key = `user-data-${definedKey}`

  return useMutation(
    (payload: UserDto) => {
      const api = new ClientUserApi()

      return api.updateOnboarding(payload)
    },
    {
      onSuccess: key
        ? (data) => {
            queryClient.setQueryData<User | undefined>(key || '', () => {
              return data
            })
          }
        : undefined,
    },
  )
}
