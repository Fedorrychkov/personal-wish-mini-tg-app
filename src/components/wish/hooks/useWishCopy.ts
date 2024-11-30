import { initHapticFeedback, initPopup } from '@tma.js/sdk'

import { Wish } from '~/entities/wish'
import { useAuth, useNotifyContext } from '~/providers'
import { useUserWishCopyMutation } from '~/query/wish'

export const useWishCopy = (wish?: Wish, onSuccess?: (wish: Wish) => void) => {
  const popup = initPopup()
  const haptic = initHapticFeedback()
  const { setNotify } = useNotifyContext()
  const { user } = useAuth()
  const isOwner = user?.id === wish?.userId

  const copyMutation = useUserWishCopyMutation(wish?.id || '', onSuccess)

  const isLoading = copyMutation?.isLoading

  const handleCopyWish = async () => {
    try {
      await copyMutation.mutateAsync()
      haptic.impactOccurred('medium')
      const message = isOwner
        ? 'Желание успешно скопировано в общий список без категорий'
        : 'Желание успешно добавлено в ваш общий список'
      setNotify(message, { severity: 'success' })
    } catch (error) {
      haptic.impactOccurred('heavy')
    }
  }

  const getPopupMessages = () => {
    const title = isOwner
      ? 'Вы уверены, что повторить желание?'
      : 'Вы уверены, что хотите скопировать это желание в свой список?'
    const message = isOwner
      ? 'Это желание снова станет доступно для всех пользователей'
      : 'Это желание будет перенесено в ваш общий список, где любой человек сможет его увидеть. Для редактироваия видимости, вам нужно будет настроить соответствующую категорию, например приватную.'

    return {
      title,
      message,
    }
  }

  const handleCopyPopup = () => {
    const { title, message } = getPopupMessages()

    popup
      .open({
        title,
        message,
        buttons: [
          { id: 'ok', type: 'default', text: isOwner ? 'Повторить желание' : 'Скопировать желание себе' },
          { id: 'cancel', type: 'destructive', text: 'Назад' },
        ],
      })
      .then((buttonId) => {
        if (!buttonId || buttonId === 'cancel') {
          return
        }

        handleCopyWish()
      })
  }

  return {
    handleCopyPopup,
    isLoading,
  }
}
