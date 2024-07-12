import { initHapticFeedback, initPopup } from '@tma.js/sdk'

import { FavoriteDto, User } from '~/entities'
import { useNotifyContext } from '~/providers'
import { useUserFavoriteMutation } from '~/query'

export const useFavoriteSettledByPopup = (listKey?: string, onSuccess?: () => void) => {
  const popup = initPopup()
  const haptic = initHapticFeedback()
  const { setNotify } = useNotifyContext()

  const favoriteMutation = useUserFavoriteMutation(listKey)

  const isLoading = favoriteMutation?.isLoading

  const handleSetFavorite = async (payload: FavoriteDto) => {
    try {
      await favoriteMutation.mutateAsync(payload)
      haptic.impactOccurred('medium')
      onSuccess?.()
      setNotify(
        `Вы успешно добавили пользователя в избранное ${payload?.wishlistNotifyEnabled ? ' и будете получать уведомления о новых желаниях' : ' без уведомлений'}`,
        { severity: 'success' },
      )
    } catch (error) {
      setNotify('Произошла ошибка при добавлении пользователя в избранные', { severity: 'error' })
      haptic.impactOccurred('heavy')
    }
  }

  const handleFavoritePopup = (payload: FavoriteDto, favoriteUser?: User) => {
    popup
      .open({
        title: `Добавить @${favoriteUser?.username || favoriteUser?.id} в избранные?`,
        message:
          'Если хотитие получать уведомления о новых желаниях пользователя, выберите кнопку "Уведомлять", иначе "Без уведомлений"',
        buttons: [
          { id: 'ok', type: 'default', text: 'Уведомлять' },
          { id: 'cancel', type: 'destructive', text: 'Без уведомлений' },
        ],
      })
      .then((buttonId) => {
        if (!buttonId) {
          return
        }

        handleSetFavorite({ ...payload, wishlistNotifyEnabled: buttonId === 'cancel' ? false : true })
      })
  }

  return {
    handleFavoritePopup,
    isLoading,
  }
}
