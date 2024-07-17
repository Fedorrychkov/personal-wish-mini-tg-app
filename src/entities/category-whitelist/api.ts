import { AxiosInstance } from 'axios'

import { Request } from '~/services'

import { CategoryWhitelist, CategoryWhitelistDto, CategoryWhitelistFilter } from './category-whitelist.type'

export class ClienCategoryWhitelistApi {
  private readonly client: AxiosInstance

  constructor() {
    this.client = new Request().apiClient
  }

  async create(body: CategoryWhitelistDto): Promise<CategoryWhitelist> {
    const response = await this.client.post('/v1/category-whitelist', body)

    return response.data
  }

  async list(query: CategoryWhitelistFilter): Promise<CategoryWhitelist[]> {
    const response = await this.client.get('/v1/category-whitelist/list', { params: query })

    return response.data
  }

  async delete(id: string): Promise<{ success: boolean; id: string }> {
    const response = await this.client.delete(`/v1/category-whitelist/${id}`)

    return response.data
  }
}
