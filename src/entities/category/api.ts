import { AxiosInstance } from 'axios'

import { Request } from '~/services'

import { Category, CategoryDto } from './category.type'

export class ClienCategoryApi {
  private readonly client: AxiosInstance

  constructor() {
    this.client = new Request().apiClient
  }

  async create(body: CategoryDto): Promise<Category> {
    const response = await this.client.post('/v1/category', body)

    return response.data
  }

  async list(id?: string): Promise<Category[]> {
    const response = await this.client.get(`/v1/category/list${id ? `/${id}` : ''}`)

    return response.data
  }

  async get(id: string): Promise<Category> {
    const response = await this.client.get(`/v1/category/${id}`)

    return response.data
  }
}
