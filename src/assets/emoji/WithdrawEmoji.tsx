import { cn } from '~/utils'

type Props = {
  className?: string
}

export const WithdrawEmoji = (props: Props) => {
  const { className } = props

  return <div className={cn('inline-block transform', className)}>💸</div>
}
