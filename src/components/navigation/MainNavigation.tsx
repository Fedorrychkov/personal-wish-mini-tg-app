import { NavLink } from 'react-router-dom'

import { HeartEmoji, InfoEmoji, ListEmoji, NewEmoji } from '~/assets'
import { ONBOARDING_DATA_NAME, useOnboarding } from '~/providers'
import { ROUTE } from '~/router'
import { cn } from '~/utils'

const routes = [
  {
    icon: <ListEmoji />,
    path: ROUTE.home,
    title: 'Желания',
  },
  {
    icon: <NewEmoji />,
    path: ROUTE.wishNew,
    title: 'Добавить',
  },
  {
    icon: <HeartEmoji />,
    path: ROUTE.favorites,
    title: 'Избранные',
  },
]

export const MainNavigation = () => {
  const { isNewKey } = useOnboarding()

  return (
    <div className="flex justify-between fixed right-0 bottom-0 left-0 bg-[var(--tg-theme-bg-color)] z-10">
      {routes?.map((route) => (
        <NavLink
          key={route.path}
          to={route.path}
          {...(route.path === ROUTE.home ? { 'data-tour': ONBOARDING_DATA_NAME.userWishList } : {})}
          {...(route.path === ROUTE.favorites ? { 'data-tour': ONBOARDING_DATA_NAME.userFavorites } : {})}
          className={({ isActive }) => {
            return cn(
              'flex font-bold flex-col items-center justify-center px-4 flex-1 py-2 pb-4 text-lg opacity-[0.7]',
              {
                '!opacity-[1] hover:!opacity-[0.8]': isActive,
                'hover:!opacity-[1]': !isActive,
              },
            )
          }}
        >
          <div className="relative flex flex-col items-center justify-center">
            {route.icon}
            <p className={cn('text-xs text-slate-900 dark:text-slate-200')}>{route.title}</p>
            {isNewKey && route.path === ROUTE.home && (
              <InfoEmoji className="font-bold absolute top-0 right-0 text-sm text-blue-600" />
            )}
          </div>
        </NavLink>
      ))}
    </div>
  )
}
