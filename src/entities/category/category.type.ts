import { Timestamp } from '../shared.type'

export type Category = {
  id: string
  userId: string
  /**
   * Max length - 200
   */
  name: string
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

export type CategoryDto = {
  name?: Category['name']
}
