import { Timestamp } from '../shared.type'

export type User = {
  id: string
  chatId?: string
  firstName?: string | null
  lastName?: string | null
  username?: string | null
  isPremium?: boolean | null
  avatarUrl?: string | null
  isBot?: boolean | null
  phone?: string | null
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}
