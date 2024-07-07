import { AxiosInstance } from 'axios'

import { Request } from '~/services'

import { Wish, WishDto } from './wish.type'

export class ClientWishApi {
  private readonly client: AxiosInstance

  constructor() {
    this.client = new Request().apiClient
  }

  async list(id?: string): Promise<Wish[]> {
    const response = await this.client.get(`/v1/wish/list${id ? `/${id}` : ''}`)

    return response.data
  }

  async get(id: string): Promise<Wish> {
    const response = await this.client.get(`/v1/wish/${id}`)

    return response.data
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const response = await this.client.delete(`/v1/wish/${id}`)

    return response.data
  }

  async bookToggle(id: string): Promise<Wish> {
    const response = await this.client.patch(`/v1/wish/book/${id}`)

    return response.data
  }

  async update(id: string, body: WishDto): Promise<Wish> {
    const response = await this.client.patch(`/v1/wish/${id}`, body)

    return response.data
  }

  async create(body: WishDto): Promise<Wish> {
    const response = await this.client.post('/v1/wish', body)

    return response.data
  }

  async uploadImage(id: string, payload: FormData): Promise<Wish> {
    const response = await this.client.post(`/v1/wish/${id}/image`, payload)

    return response.data
  }

  async removeImage(id: string): Promise<void> {
    const response = await this.client.delete(`/v1/wish/${id}/image`)

    return response.data
  }
}
