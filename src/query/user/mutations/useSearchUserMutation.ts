import { useMutation } from 'react-query'

import { ClientUserApi } from '~/entities'

export const useSearchUserMutation = () => {
  return useMutation((username: string) => {
    const api = new ClientUserApi()

    return api.findUserByUsername(username)
  })
}
