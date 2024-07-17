import { useMutation, useQueryClient } from 'react-query'

import { CategoryWhitelist, ClienCategoryWhitelistApi } from '~/entities'

export const useUserCategoryWhitelistDeleteMutation = (key?: string) => {
  const queryClient = useQueryClient()

  return useMutation(
    (id: string) => {
      const api = new ClienCategoryWhitelistApi()

      return api.delete(id)
    },
    {
      onSuccess: key
        ? (data: { success: boolean; id: string }) => {
            queryClient.setQueryData<CategoryWhitelist[] | CategoryWhitelist | undefined>(key || '', (forms = []) => {
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
