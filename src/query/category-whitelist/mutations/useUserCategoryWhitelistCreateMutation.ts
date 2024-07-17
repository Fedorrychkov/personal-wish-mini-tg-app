import { useMutation, useQueryClient } from 'react-query'

import { CategoryWhitelist, CategoryWhitelistDto, ClienCategoryWhitelistApi } from '~/entities'

export const useUserCategoryWhitelistCreateMutation = (key?: string) => {
  const queryClient = useQueryClient()

  return useMutation(
    (body: CategoryWhitelistDto) => {
      const api = new ClienCategoryWhitelistApi()

      return api.create(body)
    },
    {
      onSuccess: key
        ? (data: CategoryWhitelist) => {
            queryClient.setQueryData<CategoryWhitelist[] | CategoryWhitelist | undefined>(key || '', (forms = []) => {
              if (!Array.isArray(forms)) {
                return data
              }

              const items = forms?.map((item) => {
                if (item.id === data?.id) {
                  return data
                }

                return item
              })

              items.unshift(data)

              return items
            })
          }
        : undefined,
    },
  )
}
