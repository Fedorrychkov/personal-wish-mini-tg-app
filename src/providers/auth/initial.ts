import { AuthType } from './types'

export const initialState: AuthType = {
  user: undefined,
  isLoading: true,
  isAuthenticated: false,
  currentUserKey: '',
}
