import { initHapticFeedback, initPopup } from '@tma.js/sdk'

import { Wish, WishDto } from '~/entities/wish'
import { useNotifyContext } from '~/providers'
import { useUserWishUpdateMutation } from '~/query/wish'

export const useWishUpdate = (wish?: Wish, listKey?: string, onSuccess?: (wish: Wish) => void) => {
  const popup = initPopup()
  const updateMutation = useUserWishUpdateMutation(wish?.id || '', listKey)
  const haptic = initHapticFeedback()
  const { setNotify } = useNotifyContext()

  const isLoading = updateMutation?.isLoading

  const handleUpdateWish = async (body: WishDto) => {
    try {
      const wish = await updateMutation.mutateAsync(body)
      haptic.impactOccurred('medium')
      onSuccess?.(wish)
    } catch (error) {
      setNotify('Произошла ошибка обновления желания', { severity: 'error' })
      haptic.impactOccurred('heavy')
    }
  }

  const handleUpdatePopup = (body: WishDto) => {
    popup
      .open({
        title: 'Сохранить желание?',
        message: 'Подтвердите, что вы готовы обновить свое желание',
        buttons: [
          { id: 'ok', type: 'default', text: 'Сохранить' },
          { id: 'cancel', type: 'destructive', text: 'Назад' },
        ],
      })
      .then((buttonId) => {
        if (!buttonId || buttonId === 'cancel') {
          return
        }

        handleUpdateWish(body)
      })
  }

  return {
    handleUpdatePopup,
    isLoading,
  }
}
