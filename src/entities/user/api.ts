import { AxiosInstance } from 'axios'

import { Request } from '~/services'

import { User } from './user.type'

export class ClientUserApi {
  private readonly client: AxiosInstance

  constructor() {
    this.client = new Request().apiClient
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get('/v1/user')

    return response.data
  }

  async getUser(id: string): Promise<User> {
    const response = await this.client.get(`/v1/user/${id}`)

    return response.data
  }

  async uploadAvatar(payload: FormData): Promise<User> {
    const response = await this.client.post('/v1/user/avatar', payload)

    return response.data
  }

  async removeAvatar(): Promise<void> {
    const response = await this.client.delete('/v1/user/avatar')

    return response.data
  }
}
