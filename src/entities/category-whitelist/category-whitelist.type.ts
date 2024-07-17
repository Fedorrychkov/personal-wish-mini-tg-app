import { Timestamp } from '../shared.type'

export type CategoryWhitelist = {
  id: string
  /**
   * Пользователь, который добавил вайтлист запись
   */
  userId: string
  /**
   * Пользователь, которого добавили в вайтлист запись
   */
  whitelistedUserId: string
  categoryId: string
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

export type CategoryWhitelistDto = {
  whitelistedUserId: CategoryWhitelist['whitelistedUserId']
  categoryId: CategoryWhitelist['categoryId']
}

export type CategoryWhitelistFilter = {
  categoryId?: string
  whitelistedUserId?: string
}
