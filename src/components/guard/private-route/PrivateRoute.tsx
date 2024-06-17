import React, { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { FullPageLoading } from '~/components/loaders'
import { useAuth } from '~/providers/auth'
import { ROUTE } from '~/router'

type PrivateRouteProps = {
  redirectTo?: string
  children: ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, redirectTo = ROUTE.unavailable }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isAuthenticated) {
    return <>{children}</>
  }

  if (!isAuthenticated && !isLoading) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  if (!isAuthenticated && isLoading) {
    return <FullPageLoading />
  }

  return null
}

export { PrivateRoute }
