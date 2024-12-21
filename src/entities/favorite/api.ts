import { AxiosInstance } from 'axios'

import { Request } from '~/services'

import { Favorite, FavoriteDto } from './favorite.type'

export class ClientFavoriteApi {
  private readonly client: AxiosInstance

  constructor() {
    this.client = new Request().apiClient
  }

  async create(body: FavoriteDto): Promise<Favorite> {
    const response = await this.client.post('/v1/favorite', body)

    return response.data
  }

  async update(body: FavoriteDto): Promise<Favorite> {
    const response = await this.client.patch('/v1/favorite', body)

    return response.data
  }

  async list(): Promise<Favorite[]> {
    const response = await this.client.get('/v1/favorite/list')

    return response.data
  }

  async subscribers(userId: string): Promise<Favorite[]> {
    const response = await this.client.get('/v1/favorite/subscribers', { params: { userId } })

    return response.data
  }

  async subscribes(userId: string): Promise<Favorite[]> {
    const response = await this.client.get('/v1/favorite/subscribes', { params: { userId } })

    return response.data
  }

  async get(favoriteUserId: string): Promise<Favorite> {
    const response = await this.client.get(`/v1/favorite/${favoriteUserId}`)

    return response.data
  }

  async delete(favoriteUserId: string): Promise<{ success: boolean }> {
    const response = await this.client.delete(`/v1/favorite/${favoriteUserId}`)

    return response.data
  }
}
