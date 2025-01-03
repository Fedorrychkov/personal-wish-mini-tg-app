import { Box, Tab, Tabs } from '@mui/material'
import { useCallback, useState } from 'react'

import { GAME_LIST } from '../constants'
import { GameCardType } from '../game.types'
import { GamesWhereIAmParticipant } from './GamesWhereIAmParticipant'
import { MyGames } from './MyGames'

type SantaGameProps = {
  game: GameCardType
}

export const SantaGame = ({ game }: SantaGameProps) => {
  const [value, setValue] = useState<string>('0')

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const santaGame = GAME_LIST.find((item) => item.type === game.type)

  const handleSucessCreated = useCallback(() => {
    setValue('0')
  }, [])

  return (
    <div>
      <p className="text-xl bold text-slate-900 dark:text-white mt-2">{santaGame?.name}</p>
      <p className="text-sm text-slate-900 dark:text-white mt-2">{santaGame?.description}</p>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="Santa game tabs" variant="scrollable">
          <Tab label="Мои игры" value="0" className="w-[50%]" />
          <Tab label="Я участник" value="1" className="w-[50%]" />
        </Tabs>
      </Box>
      <div className="flex flex-col gap-4 mt-4">
        <div role="tabpanel" hidden={value !== '0'} id="simple-tabpanel-0" aria-labelledby="simple-tab-0">
          {value === '0' && <MyGames />}
        </div>
        <div role="tabpanel" hidden={value !== '1'} id="simple-tabpanel-1" aria-labelledby="simple-tab-1">
          {value === '1' && <GamesWhereIAmParticipant onSucessCreated={handleSucessCreated} />}
        </div>
        <div className="h-[64px]" />
      </div>
    </div>
  )
}
