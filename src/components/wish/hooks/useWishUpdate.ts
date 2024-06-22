import { initPopup } from '@tma.js/sdk'

import { Wish, WishDto } from '~/entities/wish'
import { useUserWishUpdateMutation } from '~/query/wish'

export const useWishUpdate = (wish?: Wish, listKey?: string, onSuccess?: () => void) => {
  const popup = initPopup()
  const updateMutation = useUserWishUpdateMutation(wish?.id || '', listKey)

  const isLoading = updateMutation?.isLoading

  const handleUpdateWish = async (body: WishDto) => {
    await updateMutation.mutateAsync(body)
    onSuccess?.()
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
