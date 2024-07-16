import { initHapticFeedback, initPopup } from '@tma.js/sdk'

import { Category, CategoryDto } from '~/entities'
import { useNotifyContext } from '~/providers'
import { useUserCategoryUpdateMutation } from '~/query'

export const useCategoryUpdate = (id: string, listKey?: string, onSuccess?: (category: Category) => void) => {
  const popup = initPopup()
  const updateMutation = useUserCategoryUpdateMutation(id, listKey)
  const haptic = initHapticFeedback()
  const { setNotify } = useNotifyContext()

  const isLoading = updateMutation?.isLoading

  const handleUpdateCategory = async (body: CategoryDto) => {
    try {
      const category = await updateMutation.mutateAsync(body)
      haptic.impactOccurred('medium')
      onSuccess?.(category)
      setNotify('Категория успешно обновлена', { severity: 'success' })
    } catch (error) {
      setNotify('Произошла ошибка обновления категории', { severity: 'error' })
      haptic.impactOccurred('heavy')
    }
  }

  const handleUpdatePopup = (body: CategoryDto) => {
    popup
      .open({
        title: 'Применить изменения?',
        message: 'Изменения будут применены ко всем желаниям в этой категории',
        buttons: [
          { id: 'ok', type: 'default', text: 'Сохранить' },
          { id: 'cancel', type: 'destructive', text: 'Назад' },
        ],
      })
      .then((buttonId) => {
        if (!buttonId || buttonId === 'cancel') {
          return
        }

        handleUpdateCategory(body)
      })
  }

  return {
    handleUpdatePopup,
    isLoading,
  }
}
