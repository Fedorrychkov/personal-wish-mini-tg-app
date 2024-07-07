import { retrieveLaunchParams } from '@tma.js/sdk'
import { useEffect, useState } from 'react'

import { API_URL } from '~/config'
import { User } from '~/entities'
import { useUserDataQuery } from '~/query'

import { initialState } from './initial'

export const useAuthState = () => {
  const launchParams = retrieveLaunchParams()

  const {
    data: userData,
    isLoading: isUserDataLoading,
    isFetched,
    key: currentUserKey,
  } = useUserDataQuery(launchParams?.initData?.user?.id?.toString() || '', undefined)

  const user: User | undefined = {
    id: '',
    ...userData,
    avatarUrl:
      userData?.avatarUrl?.includes('/v1/file') && !userData?.avatarUrl?.includes('http')
        ? `${API_URL}${userData?.avatarUrl}`
        : userData?.avatarUrl,
  }

  const [isLoading, setLoading] = useState(initialState.isLoading)

  const isAuthenticated = (!!user?.id || initialState.isAuthenticated) && isFetched

  useEffect(() => {
    setLoading(false)
  }, [user?.id])

  const isFinalLoading = isLoading || isUserDataLoading

  return {
    isLoading: isFinalLoading,
    isAuthenticated,
    user,
    currentUserKey,
  }
}
