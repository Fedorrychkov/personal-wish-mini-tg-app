import { createBrowserRouter, createRoutesFromElements, Outlet, Route, ScrollRestoration } from 'react-router-dom'

import { PrivateRoute } from '~/components/guard'
import { Favorites } from '~/pages/favorites'
import { Home } from '~/pages/home'
import { Unavailable } from '~/pages/unavailable'
import { UserWishList } from '~/pages/user-wish-list'
import { Wish } from '~/pages/wish'
import { NewWish } from '~/pages/wish-new'

import { ROUTE } from './constants'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <>
          <ScrollRestoration />
          <Outlet />
        </>
      }
    >
      <Route
        path={ROUTE.home}
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTE.userWishList}
        element={
          <PrivateRoute>
            <UserWishList />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTE.wishNew}
        element={
          <PrivateRoute>
            <NewWish />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTE.wish}
        element={
          <PrivateRoute>
            <Wish />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTE.favorites}
        element={
          <PrivateRoute>
            <Favorites />
          </PrivateRoute>
        }
      />
      <Route path={ROUTE.unavailable} element={<Unavailable />} />
    </Route>,
  ),
)
