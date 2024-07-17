import { Children, ReactNode } from 'react'

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

  const arrayChildren = Children.toArray(children)

  return (
    <>
      <div className={cn('bg-slate-100 dark:bg-slate-800 flex flex-col w-full min-h-[100vh] px-4', className)}>
        <div className="flex-1 z-[1]">{Children.map(arrayChildren, (child) => child)}</div>
        <PatternBackground patternName={customization?.patternName} />
        <div id="keyboard-appended" />
      </div>
      <MainNavigation />
    </>
  )
}
