import { initHapticFeedback, initPopup } from '@tma.js/sdk'

import { Wish } from '~/entities/wish'
import { useAuth } from '~/providers'
import { useUserDataQuery } from '~/query'
import { useUserWishBookMutation } from '~/query/wish'

export const useWishBook = (wish?: Wish, listKey?: string, onSuccess?: () => void) => {
  const popup = initPopup()
  const haptic = initHapticFeedback()
  const { user } = useAuth()
  const isOwner = user?.id === wish?.userId

  const { data: wishUserOwner } = useUserDataQuery(wish?.userId || '', wish?.userId, !isOwner)

  const bookMutation = useUserWishBookMutation(wish?.id || '', listKey)

  const isLoading = bookMutation?.isLoading

  const handleBookWish = async () => {
    try {
      await bookMutation.mutateAsync()
      haptic.impactOccurred('medium')
      onSuccess?.()
    } catch (error) {
      haptic.impactOccurred('heavy')
    }
  }

  const getPopupMessages = () => {
    const username = isOwner ? user?.username : wishUserOwner?.username

    if (!wish?.isBooked) {
      const message = isOwner
        ? 'Если вы забронируете это желание, другие не смогут его забронировать, чтобы подарить Вам.'
        : `Подтвердите, что вы хотите подарить это желание пользователю @${username}`

      return { title: 'Вы уверены, что хотите забронировать желание?', message }
    }

    const message = isOwner
      ? 'Если вы снимете бронь с этого желания, другие смогут его забронировать, чтобы подарить Вам.'
      : `Подтвердите, что вы не хотите дарить это желание пользователю @${username}`

    return { title: 'Вы уверены, что хотите отменить бронь этого желания?', message }
  }

  const handleBookPopup = () => {
    const { title, message } = getPopupMessages()

    popup
      .open({
        title,
        message,
        buttons: [
          { id: 'ok', type: 'default', text: wish?.isBooked ? 'Снять бронь' : 'Забронировать' },
          { id: 'cancel', type: 'destructive', text: 'Назад' },
        ],
      })
      .then((buttonId) => {
        if (!buttonId || buttonId === 'cancel') {
          return
        }

        handleBookWish()
      })
  }

  return {
    handleBookPopup,
    isLoading,
  }
}
