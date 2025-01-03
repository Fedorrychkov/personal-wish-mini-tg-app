import { Alert, Button, CircularProgress } from '@mui/material'

import { GameResponse, GameType } from '~/entities/games'
import { useAuth, useNotifyContext } from '~/providers'
import { useGameCreateMutation, useMyGamesQuery } from '~/query/game'

import { SantaCard } from './SantaCard'

type GameProps = {
  onSucessCreated?: (game?: GameResponse) => void
}

export const MyGames = ({ onSucessCreated }: GameProps) => {
  const { user } = useAuth()
  const { setNotify } = useNotifyContext()
  const { data: games, isLoading, key: defaultKey } = useMyGamesQuery(user?.id || '')

  const createGameMutation = useGameCreateMutation(defaultKey)

  const handleCreateGame = async () => {
    try {
      const game = await createGameMutation.mutateAsync({
        type: GameType.SANTA,
        name: '',
      })
      setNotify('Игра успешно создана', {
        severity: 'success',
      })

      onSucessCreated?.(game)
    } catch (error) {
      console.error(error)
      setNotify('Не удалось создать игру', {
        severity: 'error',
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {isLoading ? <CircularProgress /> : null}
      {games?.map((game) => <SantaCard key={game.id} game={game} />)}
      {games?.length ? null : (
        <Alert severity="info">
          Вы еще не создали ни одной игры. Нажмите на кнопку ниже, чтобы создать свою первую игру.
        </Alert>
      )}
      <Button
        type="button"
        disabled={createGameMutation.isLoading}
        color="primary"
        size="small"
        onClick={handleCreateGame}
        variant="contained"
        className="flex items-center gap-2 !p-4"
      >
        {createGameMutation.isLoading ? <CircularProgress size={20} /> : ''}
        <span>Создать игру</span>
      </Button>
    </div>
  )
}
