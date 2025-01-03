import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { GameCardType } from './game.types'

type Props = {
  game: GameCardType
}

export const GameCard = ({ game }: Props) => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-1 bg-white dark:bg-slate-900 rounded-lg">
      <div
        className="flex gap-2 items-end h-[128px] relative p-4 overflow-hidden rounded-2xl"
        style={{ backgroundColor: game.backgroundColor }}
      >
        <div
          className="w-full h-[128px] absolute top-0 left-0 z-0 p-4"
          style={{
            background: `url(${game.background})`,
            backgroundSize: 'contain',
            backgroundPosition: 'left center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <img src={game.img} alt={game.name} className="w-10 h-10 rounded-2xl object-cover z-10" />
        <p className="text-md text-white font-bold dark:text-white z-10">{game.name}</p>
      </div>
      <div className="px-4 pb-4 flex flex-col gap-4">
        <p className="text-sm text-slate-900 dark:text-white">{game.description}</p>
        <div className="flex gap-2 items-center justify-end">
          <Button
            type="button"
            color="primary"
            size="small"
            onClick={() => navigate(`/games/${game.type?.toLowerCase()}`)}
            variant="contained"
          >
            Открыть
          </Button>
        </div>
      </div>
    </div>
  )
}
