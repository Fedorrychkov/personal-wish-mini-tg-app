import { Timestamp } from '../shared.type'

export enum GameType {
  SANTA = 'SANTA',
}

export enum GameStatus {
  CREATED = 'CREATED',
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  FINISHED = 'FINISHED',
}

export type GameResponse = {
  id: string
  type: GameType
  name: string
  userId: string

  status?: GameStatus
  /**
   * Created at
   */
  createdAt?: Timestamp | null
  /**
   * Updated at
   */
  updatedAt?: Timestamp | null
}

export type GameParticipant = {
  id: string
  userId: string
  gameId?: string
  type: GameType
  isGameConfirmed?: boolean
  isGameFinished?: boolean
  recipientUserId?: string
  /**
   * Created at
   */
  createdAt?: Timestamp | null
  /**
   * Updated at
   */
  updatedAt?: Timestamp | null
}

export type CreateGameRequest = {
  type: GameType
  name: string
}

export type GamesFilter = {
  /**
   * Game id/Participant id
   */
  id?: string
  /**
   * Game status
   */
  status?: GameStatus
}

export type MutateGameRequest = {
  /**
   * Game status
   */
  status?: GameStatus
}
