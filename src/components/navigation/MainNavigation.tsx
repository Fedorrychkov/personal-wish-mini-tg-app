import { NavLink } from 'react-router-dom'

import { HeartEmoji, ListEmoji, NewEmoji } from '~/assets'
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
  return (
    <div className="flex justify-between fixed right-0 bottom-0 left-0 bg-[var(--tg-theme-bg-color)] z-10">
      {routes?.map((route) => (
        <NavLink
          key={route.path}
          to={route.path}
          className={({ isActive }) => {
            return cn('flex font-bold flex-col items-center justify-center px-4 flex-1 py-2 text-lg opacity-[0.7]', {
              '!opacity-[1] hover:!opacity-[0.8]': isActive,
              'hover:!opacity-[1]': !isActive,
            })
          }}
        >
          <>
            {route.icon}
            <p className={cn('text-xs text-slate-900 dark:text-slate-200')}>{route.title}</p>
          </>
        </NavLink>
      ))}
    </div>
  )
}
