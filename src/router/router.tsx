import { createBrowserRouter, createRoutesFromElements, Outlet, Route, ScrollRestoration } from 'react-router-dom'

import { PrivateRoute } from '~/components/guard'
import { Category } from '~/pages/category'
import { CategoryNew } from '~/pages/category-new'
import { CategorySettings } from '~/pages/category-settings'
import { DepositPage } from '~/pages/deposit'
import { Favorites } from '~/pages/favorites'
import { GameByIdPage, GamePage, Games } from '~/pages/games'
import { Home } from '~/pages/home'
import { Settings } from '~/pages/settings'
import { SubscribeRoot } from '~/pages/subscribe-root'
import { TransactionList } from '~/pages/transaction'
import { TransferPage } from '~/pages/transfer'
import { Unavailable } from '~/pages/unavailable'
import { UserWishList } from '~/pages/user-wish-list'
import { WalletPage } from '~/pages/wallet'
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
      <Route
        path={ROUTE.subscribeRoot}
        element={
          <PrivateRoute>
            <SubscribeRoot />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTE.category}
        element={
          <PrivateRoute>
            <Category />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTE.categoryNew}
        element={
          <PrivateRoute>
            <CategoryNew />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTE.categorySettings}
        element={
          <PrivateRoute>
            <CategorySettings />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTE.settings}
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTE.games}
        element={
          <PrivateRoute>
            <Games />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTE.game}
        element={
          <PrivateRoute>
            <GamePage />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTE.gameById}
        element={
          <PrivateRoute>
            <GameByIdPage />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTE.transaction}
        element={
          <PrivateRoute>
            <TransactionList />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTE.deposit}
        element={
          <PrivateRoute>
            <DepositPage />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTE.transferToUser}
        element={
          <PrivateRoute>
            <TransferPage />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTE.wallet}
        element={
          <PrivateRoute>
            <WalletPage />
          </PrivateRoute>
        }
      />
      <Route path={ROUTE.unavailable} element={<Unavailable />} />
    </Route>,
  ),
)
