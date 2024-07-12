import { Children, ReactNode } from 'react'

import { MainNavigation } from '~/components/navigation'
import { cn } from '~/utils'

type Props = {
  children: ReactNode
  className?: string
}

export const DefaultLayout = ({ children, className }: Props) => {
  const arrayChildren = Children.toArray(children)

  return (
    <div className={cn('flex flex-col w-full min-h-[100vh] px-4', className)}>
      <div className="flex-1">{Children.map(arrayChildren, (child) => child)}</div>
      <MainNavigation />
    </div>
  )
}
