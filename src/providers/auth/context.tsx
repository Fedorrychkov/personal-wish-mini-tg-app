import { createContext, FC, ReactNode, useContext } from 'react'

import { initialState } from './initial'
import { AuthType } from './types'
import { useAuthState } from './useAuthState'

const AuthContext = createContext<AuthType>(initialState)

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuthState()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

/**
 * custom hook to use the AuthProvider
 * @return {object} auth context params
 */
export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) throw new Error('useAuth must be used within a AuthProvider')

  return context
}
