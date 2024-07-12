import { initHapticFeedback, initPopup } from '@tma.js/sdk'

import { User } from '~/entities'
import { useNotifyContext } from '~/providers'
import { useUserFavoriteDeleteMutation } from '~/query'

export const useFavoriteDeleteByPopup = (favoriteUserId?: string, listKey?: string, onSuccess?: () => void) => {
  const popup = initPopup()
  const haptic = initHapticFeedback()
  const { setNotify } = useNotifyContext()

  const favoriteMutation = useUserFavoriteDeleteMutation(favoriteUserId || '', listKey)

  const isLoading = favoriteMutation?.isLoading

  const handleDeleteFavorite = async () => {
    try {
      await favoriteMutation.mutateAsync()
      haptic.impactOccurred('medium')
      onSuccess?.()
      setNotify('Пользователь удален из вашего спсика избранных', { severity: 'success' })
    } catch (error) {
      setNotify('Произошла ошибка при удалении пользователя из избранныых', { severity: 'error' })
      haptic.impactOccurred('heavy')
    }
  }

  const handleDeleteFavoritePopup = (favoriteUser?: User) => {
    popup
      .open({
        title: `Удалить @${favoriteUser?.username || favoriteUser?.id} из избранных?`,
        message: 'Подтвердите удаление пользователя из избранных',
        buttons: [
          { id: 'ok', type: 'default', text: 'Удалить' },
          { id: 'cancel', type: 'destructive', text: 'Назад' },
        ],
      })
      .then((buttonId) => {
        if (!buttonId || buttonId === 'cancel') {
          return
        }

        handleDeleteFavorite()
      })
  }

  return {
    handleDeleteFavoritePopup,
    isLoading,
  }
}
