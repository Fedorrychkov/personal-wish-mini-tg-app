import { Customization, User } from '~/entities'

export type AuthType = {
  user?: User
  isLoading: boolean
  isAuthenticated: boolean
  currentUserKey?: string
  isLoadingCustomization: boolean
  customization?: Customization
}
