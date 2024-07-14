import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react'

import { Customization } from '~/entities'
import { useUserCustomizationQuery } from '~/query/customization'

type ContextType = {
  updateUserCustomizationId: (userId?: string) => void
  customization: Customization | undefined
  isLoading: boolean
}

const CustomizationContext = createContext<ContextType>({
  updateUserCustomizationId: () => {},
  customization: undefined,
  isLoading: false,
})

export const useCustomization = () => {
  const context = useContext(CustomizationContext)

  if (!context) throw new Error('useCustomizationContext must be used within a CustomizationProvider')

  return context
}

type Props = {
  children: ReactNode
}
export const CustomizationProvider: React.FC<Props> = ({ children }) => {
  const [userId, setUserId] = useState<string | undefined>()

  const updateUserCustomizationId = useCallback((userId?: string) => {
    setUserId(userId)
  }, [])

  const { data: customization, isLoading } = useUserCustomizationQuery(userId || '', !!userId)

  const value = useMemo(
    () => ({
      updateUserCustomizationId,
      customization,
      isLoading,
    }),
    [updateUserCustomizationId, customization, isLoading],
  )

  return <CustomizationContext.Provider value={value}>{children}</CustomizationContext.Provider>
}
