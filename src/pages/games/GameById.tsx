import { CircularProgress } from '@mui/material'
import { useMemo } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'

import { SantaGameView } from '~/components/games'
import { UserHeader } from '~/components/user'
import { GameType } from '~/entities/games'
import { useTgBack } from '~/hooks'
import { DefaultLayout } from '~/layouts/default'
import { useGameQuery } from '~/query/game'
import { ROUTE } from '~/router/constants'

export const GameByIdPage = () => {
  const { id } = useParams()
  const location = useLocation()

  const { data: game, isLoading, isFetched } = useGameQuery(id || '', !!id)

  const gameComponent = useMemo(() => {
    switch (game?.type) {
      case GameType.SANTA:
        return game ? <SantaGameView game={game} /> : null
      default:
        return null
    }
  }, [game])

  const prevPage = useMemo(() => {
    if (location.state?.prevPage) {
      return location.state.prevPage
    }

    if (game?.type === GameType.SANTA) {
      return ROUTE.game.replace(':type', game?.type?.toLowerCase() || '')
    }

    return ROUTE.games
  }, [location, game])

  useTgBack({
    defaultBackPath: prevPage,
  })

  if (!game && !isLoading && isFetched) {
    return <Navigate to={ROUTE.games} />
  }

  return (
    <DefaultLayout className="!px-0">
      <UserHeader className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4" editable={false} />
      {isLoading ? <CircularProgress size={20} /> : gameComponent}
    </DefaultLayout>
  )
}
