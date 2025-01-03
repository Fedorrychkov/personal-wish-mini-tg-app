import { GameType } from '~/entities/games'

import { GameCardType } from './game.types'

export const GAME_LIST: GameCardType[] = [
  {
    type: GameType.SANTA,
    name: 'Тайный Санта',
    // TODO: add img for santa
    description:
      'Тайный Санта - это режим, в котором вы можете создать отдельную игру и пригласить в нее участников, отправив им ссылку на вступление или пригласить из вашего круга подписок и подписчиков',
    img: '/games/santa/avatar.jpeg',
    background: '/games/santa/background.jpeg',
    backgroundColor: '#b30c25',
  },
]
