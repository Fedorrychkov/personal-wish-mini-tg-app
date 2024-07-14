import { AxiosInstance } from 'axios'

import { Request } from '~/services'

import { Customization, CustomizationDto } from './customization.type'

export class ClientCustomizationApi {
  private readonly client: AxiosInstance

  constructor() {
    this.client = new Request().apiClient
  }

  async createOrUpdate(body: CustomizationDto): Promise<Customization> {
    const response = await this.client.post('/v1/customization', body)

    return response.data
  }

  async get(userId: string): Promise<Customization> {
    const response = await this.client.get(`/v1/customization/${userId}`)

    return response.data
  }
}
