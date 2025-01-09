import { AxiosInstance } from 'axios'

import { Request } from '~/services'

import { CreateGameRequest, GameParticipant, GameResponse, GamesFilter, MutateGameRequest } from './game.type'

export class ClientGamesApi {
  private readonly client: AxiosInstance

  constructor() {
    this.client = new Request().apiClient
  }

  async createGame(game: CreateGameRequest): Promise<GameResponse> {
    const response = await this.client.post<GameResponse>('/v1/game', game)

    return response.data
  }

  async getGame(gameId: string): Promise<GameResponse> {
    const response = await this.client.get<GameResponse>(`/v1/game/${gameId}`)

    return response.data
  }

  async mutateGame(gameId: string, data: MutateGameRequest): Promise<GameResponse> {
    const response = await this.client.patch<GameResponse>(`/v1/game/${gameId}`, data)

    return response.data
  }

  async getMyGames(filter?: GamesFilter): Promise<GameResponse[]> {
    const response = await this.client.get<GameResponse[]>('/v1/game/my', { params: filter })

    return response.data
  }

  async getGamesWhenIAmParticipant(filter?: GamesFilter): Promise<GameResponse[]> {
    const response = await this.client.get<GameResponse[]>('/v1/game/by-participant', { params: filter })

    return response.data
  }

  async getGameParticipants(gameId: string): Promise<GameParticipant[]> {
    const response = await this.client.get<GameParticipant[]>(`/v1/game/${gameId}/participant`)

    return response.data
  }

  async getGameMyParticipant(gameId: string): Promise<GameParticipant> {
    const response = await this.client.get<GameParticipant>(`/v1/game/${gameId}/participant/my`)

    return response.data
  }

  async getGameMySanta(gameId: string): Promise<GameParticipant> {
    const response = await this.client.get<GameParticipant>(`/v1/game/${gameId}/participant/my/santa`)

    return response.data
  }

  async shareGameWithParticipant(gameId: string, userId: string): Promise<GameParticipant> {
    const response = await this.client.post<GameParticipant>(`/v1/game/${gameId}/participant`, { userId })

    return response.data
  }

  async acceptGameInvitation(gameId: string): Promise<GameParticipant> {
    const response = await this.client.patch<GameParticipant>(`/v1/game/${gameId}/participant`)

    return response.data
  }
}
