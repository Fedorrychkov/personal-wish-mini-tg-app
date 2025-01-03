import { initHapticFeedback, initPopup } from '@tma.js/sdk'
import { AxiosError } from 'axios'

import { GameStatus, MutateGameRequest } from '~/entities/games'
import { useNotifyContext } from '~/providers'
import { useGameMutateMutation } from '~/query/game'

export const useFinishByPopup = (gameId: string, definedKey?: string, onSuccess?: () => void) => {
  const popup = initPopup()
  const haptic = initHapticFeedback()
  const { setNotify } = useNotifyContext()

  const gameMutation = useGameMutateMutation(gameId, definedKey)

  const isLoading = gameMutation?.isLoading

  const handleFinish = async (data: MutateGameRequest) => {
    try {
      await gameMutation.mutateAsync(data)
      haptic.impactOccurred('medium')
      onSuccess?.()
      setNotify('Игра успешно завершена и перенесена в архив', { severity: 'success' })
    } catch (error) {
      if (error instanceof AxiosError) {
        setNotify(error?.response?.data?.message || 'Произошла ошибка при завершении игры', {
          severity: 'error',
        })
      } else {
        setNotify('Произошла ошибка при завершении игры', { severity: 'error' })
      }
      haptic.impactOccurred('heavy')
    }
  }

  const handleFinishPopup = () => {
    popup
      .open({
        title: 'Вы точно хотите завершить игру?',
        message: 'Игра пропадет из общего списка, но останется доступной для просмотра из сообщений бота в личке',
        buttons: [
          { id: 'ok', type: 'default', text: 'Завершить' },
          { id: 'cancel', type: 'destructive', text: 'Назад' },
        ],
      })
      .then((buttonId) => {
        if (!buttonId || buttonId === 'cancel') {
          return
        }

        handleFinish({ status: GameStatus.FINISHED })
      })
  }

  return {
    handleFinishPopup,
    isLoading,
  }
}
