import * as favorites from './favorites'
import * as user from './user'
import * as wish from './wish'

export type SupportedErrorCodes = keyof typeof wish.ERROR_CODES

export const ERRORS: Record<string, { ERROR_CODES: Record<string, string>; TRANSLATIONS: Record<string, string> }> = {
  wish,
  user,
  favorites,
}

export type ErrorModule = 'wish' | 'user' | 'favorites'
