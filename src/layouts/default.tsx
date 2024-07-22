import { Children, ReactNode, useMemo } from 'react'

import { PatternBackground } from '~/components/background'
import { MainNavigation } from '~/components/navigation'
import { OnboardingWelcome, useCustomization, useLayout } from '~/providers'
import { cn } from '~/utils'

type Props = {
  children: ReactNode
  className?: string
}

export const DefaultLayout = ({ children, className }: Props) => {
  const { customization } = useCustomization()
  const { currentHeight } = useLayout()
  const arrayChildren = Children.toArray(children)

  const style = useMemo(() => ({ minHeight: currentHeight }), [currentHeight])

  return (
    <>
      <div className={cn('bg-slate-100 dark:bg-slate-800 flex flex-col w-full px-4', className)} style={style}>
        <div className="flex-1 z-[1]">{Children.map(arrayChildren, (child) => child)}</div>
        <PatternBackground patternName={customization?.patternName} />
        <div id="keyboard-appended" style={{ minHeight: 68 }} />
      </div>
      <MainNavigation />
      <OnboardingWelcome />
    </>
  )
}
