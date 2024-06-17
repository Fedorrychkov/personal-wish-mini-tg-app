import { Children, ReactNode } from 'react'

import { cn } from '~/utils'

type Props = {
  children: ReactNode
  className?: string
}

export const DefaultLayout = ({ children, className }: Props) => {
  const arrayChildren = Children.toArray(children)

  return (
    <div className={cn('flex flex-col w-full px-4', className)}>{Children.map(arrayChildren, (child) => child)}</div>
  )
}
