import { Children, ReactNode } from 'react'

import { getBackgroundStyle } from '~/components/background'
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
      <div
        className={cn('bg-white dark:bg-slate-800 flex flex-col w-full min-h-[100vh] px-4 custom', className)}
        style={getBackgroundStyle(customization?.patternName)}
      >
        <div className="flex-1">{Children.map(arrayChildren, (child) => child)}</div>
      </div>
      <MainNavigation />
    </>
  )
}
