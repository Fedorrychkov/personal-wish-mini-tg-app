import { initHapticFeedback, initPopup } from '@tma.js/sdk'

import { WishDto } from '~/entities/wish'
import { useUserWishCreateMutation } from '~/query/wish'

export const useWishCreate = (listKey?: string, onSuccess?: () => void) => {
  const popup = initPopup()
  const createMutation = useUserWishCreateMutation(listKey)
  const haptic = initHapticFeedback()

  const isLoading = createMutation?.isLoading

  const handleCreateWish = async (body: WishDto) => {
    try {
      await createMutation.mutateAsync(body)
      haptic.impactOccurred('medium')
      onSuccess?.()
    } catch (error) {
      haptic.impactOccurred('heavy')
    }
  }

  const handleCreatePopup = (body: WishDto) => {
    popup
      .open({
        title: 'Создать желание?',
        message: 'Подтвердите, что вы готовы создать новое желание',
        buttons: [
          { id: 'ok', type: 'default', text: 'Создать' },
          { id: 'cancel', type: 'destructive', text: 'Назад' },
        ],
      })
      .then((buttonId) => {
        if (!buttonId || buttonId === 'cancel') {
          return
        }

        handleCreateWish(body)
      })
  }

  return {
    handleCreatePopup,
    isLoading,
  }
}
