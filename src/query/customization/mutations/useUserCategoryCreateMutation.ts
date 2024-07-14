import { useMutation, useQueryClient } from 'react-query'

import { ClientCustomizationApi, Customization, CustomizationDto } from '~/entities'

export const useUserCustomizationCreateMutation = (key?: string) => {
  const queryClient = useQueryClient()

  return useMutation(
    (body: CustomizationDto) => {
      const api = new ClientCustomizationApi()

      return api.createOrUpdate(body)
    },
    {
      onSuccess: key
        ? (data: Customization) => {
            queryClient.setQueryData<Customization | undefined>(`user-customization-${key}` || '', () => {
              return data
            })
          }
        : undefined,
    },
  )
}
