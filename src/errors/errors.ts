import * as favorites from './favorites'
import * as transaction from './transaction'
import * as user from './user'
import * as wish from './wish'

export type SupportedErrorCodes =
  | keyof typeof wish.ERROR_CODES
  | keyof typeof transaction.ERROR_CODES
  | keyof typeof user.ERROR_CODES
  | keyof typeof favorites.ERROR_CODES

export const ERRORS: Record<string, { ERROR_CODES: Record<string, string>; TRANSLATIONS: Record<string, string> }> = {
  wish,
  user,
  favorites,
  transaction,
}

export type ErrorModule = 'wish' | 'user' | 'favorites' | 'transaction'
