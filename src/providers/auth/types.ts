import { User } from '~/entities'

export type AuthType = {
  user?: User
  isLoading: boolean
  isAuthenticated: boolean
}
