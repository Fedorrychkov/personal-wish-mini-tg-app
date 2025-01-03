import { useMemo } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { GAME_LIST, SantaGame } from '~/components/games'
import { UserHeader } from '~/components/user'
import { useTgBack } from '~/hooks'
import { DefaultLayout } from '~/layouts/default'
import { ROUTE } from '~/router/constants'

export const GamePage = () => {
  useTgBack({ defaultBackPath: ROUTE.games })

  const { type } = useParams()

  const game = useMemo(() => GAME_LIST?.find((game) => game.type?.toLowerCase() === type), [type])

  const gameComponent = useMemo(() => {
    switch (type) {
      case 'santa':
        return game ? <SantaGame game={game} /> : null
      default:
        return null
    }
  }, [type, game])

  if (!game) {
    return <Navigate to={ROUTE.games} />
  }

  return (
    <DefaultLayout className="!px-0">
      <UserHeader className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4" editable={false} />
      <div className="px-4">
        <div className="py-4 flex justify-between items-center">
          <h3 className="text-xl bold text-slate-900 dark:text-white">Игра: {game?.name}</h3>
        </div>

        <div className="w-full h-[1px] bg-gray-400" />
        {gameComponent}
      </div>
    </DefaultLayout>
  )
}
