import { initViewport, requestViewport } from '@tma.js/sdk'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type ContextType = {
  currentHeight?: number
}

const LayoutContext = createContext<ContextType>({
  currentHeight: 200,
})

export const useLayout = () => {
  const context = useContext(LayoutContext)

  if (!context) throw new Error('useLayout must be used within a LayoutProvider')

  return context
}

type Props = {
  children?: React.ReactNode
}

export const LayoutProvider: React.FC<Props> = ({ children }) => {
  const [currentHeight, setHeight] = useState<number | undefined>()
  const [expanded, setExpanded] = useState(false)

  const [viewport] = initViewport()

  requestViewport().then((data) => {
    setHeight(data.height)
  })

  const heightHandler = useCallback((height: number) => setHeight(height), [])

  useEffect(() => {
    viewport.then((state) => {
      if (!state.isExpanded && !expanded) {
        state.expand()
        setExpanded(true)
      }

      state.on('change:height', heightHandler)
    })

    return () => {
      viewport.then((state) => {
        state.off('change:height', heightHandler)
      })
    }
  }, [viewport, expanded, heightHandler])

  const value = useMemo(() => ({ currentHeight }), [currentHeight])

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
}
