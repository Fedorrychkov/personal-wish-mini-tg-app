import { GameType } from '~/entities/games'

export type GameCardType = {
  type: GameType
  name: string
  img?: string
  description?: string
  background?: string
  backgroundColor?: string
}
