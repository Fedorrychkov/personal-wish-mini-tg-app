import { cn } from '~/utils'

type Props = {
  className?: string
}

export const GamesEmoji = (props: Props) => {
  const { className } = props

  return <div className={cn('inline-block', className)}>🎮</div>
}
