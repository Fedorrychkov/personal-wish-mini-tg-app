import { cn } from '~/utils'

import style from './style.module.css'

type Props = {
  className?: string
}

export const Spinner = ({ className }: Props) => (
  <div className={cn(style['three-quarter-spinner'], 'border-color-slate-900 dark:border-color-white', className)} />
)
