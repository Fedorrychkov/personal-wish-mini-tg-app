import { cn } from '~/utils'

import { RainbowLoader } from '../components'

type Props = {
  className?: string
}

export const FullPageLoading = ({ className }: Props) => {
  return (
    <div className={cn('w-full h-full flex items-center justify-center', className)}>
      <RainbowLoader />
    </div>
  )
}
