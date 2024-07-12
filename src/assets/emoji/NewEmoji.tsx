import { cn } from '~/utils'

type Props = {
  className?: string
}

export const NewEmoji = (props: Props) => {
  const { className } = props

  return <div className={cn('inline-block', className)}>🆕</div>
}
