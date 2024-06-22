import { initPopup } from '@tma.js/sdk'

import { Wish } from '~/entities/wish'
import { useUserWishDeleteMutation } from '~/query/wish'

export const useWishDelete = (wish?: Wish, listKey?: string, onSuccess?: () => void) => {
  const popup = initPopup()

  const deleteMutation = useUserWishDeleteMutation(wish?.id || '', listKey)

  const isLoading = deleteMutation?.isLoading

  const handleDeleteWish = async () => {
    await deleteMutation.mutateAsync()
    onSuccess?.()
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
