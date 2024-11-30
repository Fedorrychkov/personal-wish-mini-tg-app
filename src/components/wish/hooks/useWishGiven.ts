import { initHapticFeedback, initPopup } from '@tma.js/sdk'

import { Wish } from '~/entities/wish'
import { useNotifyContext } from '~/providers'
import { useUserWishGivenMutation } from '~/query/wish'

export const useWishGiven = (wish?: Wish, listKey?: string, onSuccess?: () => void) => {
  const popup = initPopup()
  const haptic = initHapticFeedback()
  const { setNotify } = useNotifyContext()

  const givenMutation = useUserWishGivenMutation(wish?.id || '', listKey)

  const isLoading = givenMutation?.isLoading

  const handleGivenWish = async () => {
    try {
      await givenMutation.mutateAsync()
      haptic.impactOccurred('medium')
      onSuccess?.()
      setNotify('Желание успешно переведено в подаренные', { severity: 'success' })
    } catch (error) {
      haptic.impactOccurred('heavy')
    }
  }

  const getPopupMessages = () => {
    return {
      title: 'Вы уверены, что хотите перевести желание в подаренные?',
      message: 'Данное действие пока нельзя будет отменить',
    }
  }

  const handleGivenPopup = () => {
    const { title, message } = getPopupMessages()

    popup
      .open({
        title,
        message,
        buttons: [
          { id: 'ok', type: 'default', text: 'Подтвердить' },
          { id: 'cancel', type: 'destructive', text: 'Назад' },
        ],
      })
      .then((buttonId) => {
        if (!buttonId || buttonId === 'cancel') {
          return
        }

        handleGivenWish()
      })
  }

  return {
    handleGivenPopup,
    isLoading,
  }
}
