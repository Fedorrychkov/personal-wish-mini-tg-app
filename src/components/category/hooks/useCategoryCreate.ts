import { initHapticFeedback, initPopup } from '@tma.js/sdk'

import { Category, CategoryDto } from '~/entities'
import { useNotifyContext } from '~/providers'
import { useUserCategoryCreateMutation } from '~/query'

export const useCategoryCreate = (listKey?: string, onSuccess?: (category: Category) => void) => {
  const popup = initPopup()
  const createMutation = useUserCategoryCreateMutation(listKey)
  const haptic = initHapticFeedback()
  const { setNotify } = useNotifyContext()

  const isLoading = createMutation?.isLoading

  const handleCreateCategory = async (body: CategoryDto) => {
    try {
      const category = await createMutation.mutateAsync(body)
      haptic.impactOccurred('medium')
      onSuccess?.(category)
      setNotify('Категория успешно создана', { severity: 'success' })
    } catch (error) {
      setNotify('Произошла ошибка создания категории', { severity: 'error' })
      haptic.impactOccurred('heavy')
    }
  }

  const handleCreatePopup = (body: CategoryDto) => {
    popup
      .open({
        title: 'Сохранить новую категорию?',
        message: 'У вас появится новая категория, она будет пустой, если не заполнить ее желаниями',
        buttons: [
          { id: 'ok', type: 'default', text: 'Сохранить' },
          { id: 'cancel', type: 'destructive', text: 'Назад' },
        ],
      })
      .then((buttonId) => {
        if (!buttonId || buttonId === 'cancel') {
          return
        }

        handleCreateCategory(body)
      })
  }

  return {
    handleCreatePopup,
    isLoading,
  }
}
