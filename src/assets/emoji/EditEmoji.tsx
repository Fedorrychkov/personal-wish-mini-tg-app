import { cn } from '~/utils'

type Props = {
  className?: string
}

export const EditEmoji = (props: Props) => {
  const { className } = props

  return <div className={cn('inline-block transform rotate-90', className)}>✏️</div>
}
