import { cn } from '~/utils'

import { GAME_LIST } from './constants'
import { GameCard } from './GameCard'

type Props = {
  className?: string
}

export const GameList = ({ className }: Props) => {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {GAME_LIST.map((game) => (
        <GameCard key={game.type} game={game} />
      ))}
    </div>
  )
}
