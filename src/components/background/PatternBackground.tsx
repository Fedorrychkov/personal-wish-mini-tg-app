import { cn } from '~/utils'

import { getBackgroundStyle } from './utils'

type Props = {
  patternName?: string
  className?: string
}

export const PatternBackground = ({ patternName, className }: Props) => {
  return (
    <div
      style={getBackgroundStyle(patternName)}
      className={cn('fixed top-0 left-0 right-0 bottom-0 z-[0] custom', className)}
    />
  )
}
