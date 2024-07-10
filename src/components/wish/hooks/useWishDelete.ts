import { initHapticFeedback, initPopup } from '@tma.js/sdk'

import { Wish } from '~/entities/wish'
import { useNotifyContext } from '~/providers'
import { useUserWishDeleteMutation } from '~/query/wish'

export const useWishDelete = (wish?: Wish, listKey?: string, onSuccess?: () => void) => {
  const popup = initPopup()
  const haptic = initHapticFeedback()
  const { setNotify } = useNotifyContext()

  const deleteMutation = useUserWishDeleteMutation(wish?.id || '', listKey)

  const isLoading = deleteMutation?.isLoading

  const handleDeleteWish = async () => {
    try {
      await deleteMutation.mutateAsync()
      haptic.impactOccurred('medium')
      onSuccess?.()
      setNotify('Желание успешно удалено', { severity: 'success' })
    } catch (error) {
      haptic.impactOccurred('heavy')
      setNotify('Произошла ошибка при удалении желания', { severity: 'error' })
    }
  }

  const handleDeletePopup = () => {
    popup
      .open({
        title: 'Вы уверены, что хотите удалить желание?',
        message:
          'Удаление желания приведет к потере данных о нем, ваши друзья больше не смогу увидеть это желание в вашем списке',
        buttons: [
          { id: 'ok', type: 'default', text: 'Удалить' },
          { id: 'cancel', type: 'destructive', text: 'Назад' },
        ],
      })
      .then((buttonId) => {
        if (!buttonId || buttonId === 'cancel') {
          return
        }

        handleDeleteWish()
      })
  }

  return {
    handleDeletePopup,
    isLoading,
  }
}
