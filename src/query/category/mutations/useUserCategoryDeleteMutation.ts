import { useMutation, useQueryClient } from 'react-query'

import { Category, ClienCategoryApi } from '~/entities'

export const useUserCategoryDeleteMutation = (key?: string) => {
  const queryClient = useQueryClient()

  return useMutation(
    (id: string) => {
      const api = new ClienCategoryApi()

      return api.delete(id)
    },
    {
      onSuccess: key
        ? (data: Category) => {
            queryClient.setQueryData<Category[] | Category | undefined>(key || '', (forms = []) => {
              if (!Array.isArray(forms)) {
                return undefined
              }

              const items = forms?.filter((item) => item.id !== data?.id)

              return items
            })
          }
        : undefined,
    },
  )
}
