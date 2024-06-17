import { ReactNode } from 'react'

import { cn } from '~/utils'

type Props = {
  text: ReactNode
  className?: string
}

export const Avatar = ({ className, text }: Props) => {
  return (
    <div className={cn('flex justify-center items-center bg-slate-200 dark:bg-slate-500', className)}>
      <p className={cn('text-lg text-slate-900 dark:text-white')}>{text}</p>
    </div>
  )
}
