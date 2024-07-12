import { Timestamp } from '../shared.type'

export type Favorite = {
  id: string
  /**
   * Пользователь, который нажал на Favorite
   */
  userId: string
  /**
   * Пользователь, на котором нажали Favorite
   */
  favoriteUserId: string
  wishlistNotifyEnabled?: boolean | null
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

export type FavoriteDto = {
  favoriteUserId: Favorite['favoriteUserId']
  wishlistNotifyEnabled: Favorite['wishlistNotifyEnabled']
}
