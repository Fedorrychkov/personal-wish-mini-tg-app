import { initHapticFeedback, initPopup } from '@tma.js/sdk'

import { Category } from '~/entities'
import { useNotifyContext } from '~/providers'
import { useUserCategoryDeleteMutation } from '~/query'

export const useCategoryDelete = (category?: Category, listKey?: string, onSuccess?: (category: Category) => void) => {
  const popup = initPopup()
  const deleteMutation = useUserCategoryDeleteMutation(listKey)
  const haptic = initHapticFeedback()
  const { setNotify } = useNotifyContext()

  const isLoading = deleteMutation?.isLoading

  const handleDeleteCategory = async (id: string) => {
    try {
      const category = await deleteMutation.mutateAsync(id)
      haptic.impactOccurred('medium')
      onSuccess?.(category)
      setNotify('Категория успешно удалена', { severity: 'success' })
    } catch (error) {
      setNotify('Произошла ошибка удаления категории', { severity: 'error' })
      haptic.impactOccurred('heavy')
    }
  }

  const handleDeletePopup = (id: string) => {
    popup
      .open({
        title: `Удалить категорию ${category?.name || 'Без названия'}?`,
        message:
          'Удаление категории сбросит привязанные желания в список без категорий, общий список доступен всем желающим',
        buttons: [
          { id: 'ok', type: 'default', text: 'Сохранить' },
          { id: 'cancel', type: 'destructive', text: 'Назад' },
        ],
      })
      .then((buttonId) => {
        if (!buttonId || buttonId === 'cancel') {
          return
        }

        handleDeleteCategory(id)
      })
  }

  return {
    handleDeletePopup,
    isLoading,
  }
}
