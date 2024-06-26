import { createBrowserRouter } from 'react-router-dom'

import { PrivateRoute } from '~/components/guard'
import { Home } from '~/pages/home'
import { Unavailable } from '~/pages/unavailable'
import { Wish } from '~/pages/wish'

import { ROUTE } from './constants'

export const router = createBrowserRouter([
  {
    path: ROUTE.home,
    element: (
      <PrivateRoute>
        <Home />
      </PrivateRoute>
    ),
  },
  {
    path: ROUTE.wish,
    element: (
      <PrivateRoute>
        <Wish />
      </PrivateRoute>
    ),
  },
  {
    path: ROUTE.unavailable,
    element: <Unavailable />,
  },
])
