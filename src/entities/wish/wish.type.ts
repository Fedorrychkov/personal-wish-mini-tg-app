import { Timestamp } from '../shared.type'

export type Wish = {
  id: string
  userId: string
  /**
   * Max length - 300
   */
  name: string
  isBooked?: boolean | null
  bookedUserId?: string | null
  /**
   * Max length - 1000
   */
  description?: string
  link?: string | null
  categoryId?: string | null
  imageUrl?: string
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

export type WishDto = {
  name?: Wish['name']
  description?: Wish['description']
  link?: Wish['link']
  categoryId?: Wish['categoryId']
  imageUrl?: Wish['imageUrl']
}

export type WishFilter = {
  categoryId?: string
}
