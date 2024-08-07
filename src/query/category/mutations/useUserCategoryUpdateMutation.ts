import { useMutation, useQueryClient } from 'react-query'

import { Category, CategoryDto, ClienCategoryApi } from '~/entities'

export const useUserCategoryUpdateMutation = (id: string, key?: string) => {
  const queryClient = useQueryClient()

  return useMutation(
    (body: CategoryDto) => {
      const api = new ClienCategoryApi()

      return api.update(id, body)
    },
    {
      onSuccess: key
        ? (data: Category) => {
            queryClient.setQueryData<Category[] | Category | undefined>(key || '', (forms = []) => {
              if (!Array.isArray(forms)) {
                return data
              }

              const items = forms?.map((item) => {
                if (item.id === data?.id) {
                  return data
                }

                return item
              })

              return items
            })
          }
        : undefined,
    },
  )
}
