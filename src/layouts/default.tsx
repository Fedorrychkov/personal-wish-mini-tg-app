import { initViewport, requestViewport } from '@tma.js/sdk'
import { Children, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

import { PatternBackground } from '~/components/background'
import { MainNavigation } from '~/components/navigation'
import { useCustomization } from '~/providers'
import { cn } from '~/utils'

type Props = {
  children: ReactNode
  className?: string
}

export const DefaultLayout = ({ children, className }: Props) => {
  const { customization } = useCustomization()
  const [currentHeight, setHeight] = useState<number | undefined>()
  const [expanded, setExpanded] = useState(false)

  const [viewport] = initViewport()

  const arrayChildren = Children.toArray(children)

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

  const style = useMemo(() => ({ minHeight: currentHeight }), [currentHeight])

  return (
    <>
      <div className={cn('bg-slate-100 dark:bg-slate-800 flex flex-col w-full px-4', className)} style={style}>
        <div className="flex-1 z-[1]">{Children.map(arrayChildren, (child) => child)}</div>
        <PatternBackground patternName={customization?.patternName} />
        <div id="keyboard-appended" style={{ minHeight: 82 }} />
      </div>
      <MainNavigation />
    </>
  )
}
