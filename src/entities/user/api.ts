import { AxiosInstance } from 'axios'

import { Request } from '~/services'

import { User } from './user.type'

export class ClientUserApi {
  private readonly client: AxiosInstance

  constructor() {
    this.client = new Request().apiClient
  }

  async getUser(): Promise<User> {
    const response = await this.client.get('/v1/user')

    return response.data
  }
}
