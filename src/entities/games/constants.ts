import { ChipProps } from '@mui/material'

import { GameStatus } from './game.type'

export const GAME_STATUS_NAMES: Record<GameStatus, string> = {
  [GameStatus.CREATED]: 'Создана',
  [GameStatus.ACTIVE]: 'Уже началась',
  [GameStatus.CANCELLED]: 'Отменена',
  [GameStatus.FINISHED]: 'Завершена',
}

export const GAME_STATUS_COLORS: Record<GameStatus, ChipProps['color']> = {
  [GameStatus.CREATED]: 'info',
  [GameStatus.ACTIVE]: 'primary',
  [GameStatus.CANCELLED]: 'error',
  [GameStatus.FINISHED]: 'success',
}

export const gameStatusNames = (status?: GameStatus) => {
  return status ? GAME_STATUS_NAMES[status] : ''
}

export const gameStatusColors = (status?: GameStatus) => {
  return status ? GAME_STATUS_COLORS[status] : 'info'
}
