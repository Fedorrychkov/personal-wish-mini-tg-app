import { initHapticFeedback, initPopup } from '@tma.js/sdk'

import { FavoriteDto, User } from '~/entities'
import { useNotifyContext } from '~/providers'
import { useUserFavoriteUpdateMutation } from '~/query'

export const useFavoriteUpdateByPopup = (listKey?: string, onSuccess?: () => void) => {
  const popup = initPopup()
  const haptic = initHapticFeedback()
  const { setNotify } = useNotifyContext()

  const favoriteMutation = useUserFavoriteUpdateMutation(listKey)

  const isLoading = favoriteMutation?.isLoading

  const handleUpdateFavorite = async (payload: FavoriteDto) => {
    try {
      await favoriteMutation.mutateAsync({ ...payload, wishlistNotifyEnabled: !payload?.wishlistNotifyEnabled })
      haptic.impactOccurred('medium')
      onSuccess?.()
      setNotify(`Вы успешно ${payload?.wishlistNotifyEnabled ? ' включили уведомления' : ' отключили уведомлений'}`, {
        severity: 'success',
      })
    } catch (error) {
      setNotify('Произошла ошибка при обновлении уведомлений от пользователя', { severity: 'error' })
      haptic.impactOccurred('heavy')
    }
  }

  const handleFavoriteUpdatePopup = (payload: FavoriteDto, favoriteUser?: User) => {
    popup
      .open({
        title: `${payload?.wishlistNotifyEnabled ? 'Отключить' : 'Включить'} уведомления от @${favoriteUser?.username || favoriteUser?.id}?`,
        message: 'Подтвердите действие обновления состояния уведомлений',
        buttons: [
          { id: 'ok', type: 'default', text: payload?.wishlistNotifyEnabled ? 'Отключть' : 'Уведомлять' },
          { id: 'cancel', type: 'destructive', text: 'Назад' },
        ],
      })
      .then((buttonId) => {
        if (!buttonId || buttonId === 'cancel') {
          return
        }

        handleUpdateFavorite(payload)
      })
  }

  return {
    handleFavoriteUpdatePopup,
    isLoading,
  }
}
