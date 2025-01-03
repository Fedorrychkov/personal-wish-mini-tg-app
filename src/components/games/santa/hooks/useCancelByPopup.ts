import { initHapticFeedback, initPopup } from '@tma.js/sdk'

import { GameStatus, MutateGameRequest } from '~/entities/games'
import { useNotifyContext } from '~/providers'
import { useGameMutateMutation } from '~/query/game'

export const useCancelByPopup = (gameId: string, definedKey?: string, onSuccess?: () => void) => {
  const popup = initPopup()
  const haptic = initHapticFeedback()
  const { setNotify } = useNotifyContext()

  const gameMutation = useGameMutateMutation(gameId, definedKey)

  const isLoading = gameMutation?.isLoading

  const handleCancel = async (data: MutateGameRequest) => {
    try {
      await gameMutation.mutateAsync(data)
      haptic.impactOccurred('medium')
      onSuccess?.()
      setNotify('Вы успешно отменили игру', { severity: 'success' })
    } catch (error) {
      setNotify('Произошла ошибка при отмене игры', { severity: 'error' })
      haptic.impactOccurred('heavy')
    }
  }

  const handleCancelPopup = () => {
    popup
      .open({
        title: 'Вы точно хотите отменить игру?',
        message: 'Участники получать уведомление об отмене игры',
        buttons: [
          { id: 'ok', type: 'default', text: 'Отменить' },
          { id: 'cancel', type: 'destructive', text: 'Назад' },
        ],
      })
      .then((buttonId) => {
        if (!buttonId || buttonId === 'cancel') {
          return
        }

        handleCancel({ status: GameStatus.CANCELLED })
      })
  }

  return {
    handleCancelPopup,
    isLoading,
  }
}
