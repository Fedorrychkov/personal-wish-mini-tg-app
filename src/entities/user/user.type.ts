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
  appOnboardingKey?: string | null
  role?: UserRole[] | null
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

export enum UserRole {
  ADMIN = 'ADMIN_ROLE',
  USER = 'USER_ROLE',
}

export type UserDto = {
  appOnboardingKey?: string
}
