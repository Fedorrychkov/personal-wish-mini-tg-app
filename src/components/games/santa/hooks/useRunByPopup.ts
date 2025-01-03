import { initHapticFeedback, initPopup } from '@tma.js/sdk'
import { AxiosError } from 'axios'

import { GameStatus, MutateGameRequest } from '~/entities/games'
import { useNotifyContext } from '~/providers'
import { useGameMutateMutation } from '~/query/game'

export const useRunByPopup = (gameId: string, definedKey?: string, onSuccess?: () => void) => {
  const popup = initPopup()
  const haptic = initHapticFeedback()
  const { setNotify } = useNotifyContext()

  const gameMutation = useGameMutateMutation(gameId, definedKey)

  const isLoading = gameMutation?.isLoading

  const handleRun = async (data: MutateGameRequest) => {
    try {
      await gameMutation.mutateAsync(data)
      haptic.impactOccurred('medium')
      onSuccess?.()
      setNotify('Тайные санты успешно назначены, игроки получат уведомление', { severity: 'success' })
    } catch (error) {
      if (error instanceof AxiosError) {
        setNotify(error?.response?.data?.message || 'Произошла ошибка при назначении тайных сант', {
          severity: 'error',
        })
      } else {
        setNotify('Произошла ошибка при назначении тайных сант', { severity: 'error' })
      }
      haptic.impactOccurred('heavy')
    }
  }

  const handleRunPopup = () => {
    popup
      .open({
        title: 'Вы точно хотите назначить тайных сант?',
        message: 'Все санты, подтвердившие участие, получат уведомление о назначении своих подопечных',
        buttons: [
          { id: 'ok', type: 'default', text: 'Назначить' },
          { id: 'cancel', type: 'destructive', text: 'Назад' },
        ],
      })
      .then((buttonId) => {
        if (!buttonId || buttonId === 'cancel') {
          return
        }

        handleRun({ status: GameStatus.ACTIVE })
      })
  }

  return {
    handleRunPopup,
    isLoading,
  }
}
