import { useQueryClient } from 'react-query'

import { User } from '~/entities'

export const useGetUserFromStorageDataById = () => {
  const queryClient = useQueryClient()

  const handleGetUserData = (userId: string) => {
    return queryClient.getQueryData<User | undefined>(`user-data-${userId}` || '')
  }

  return {
    handleGetUserData,
  }
}
