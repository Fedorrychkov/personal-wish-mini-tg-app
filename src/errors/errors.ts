import * as wish from './wish'

export type SupportedErrorCodes = keyof typeof wish.ERROR_CODES

export const ERRORS: Record<string, { ERROR_CODES: Record<string, string>; TRANSLATIONS: Record<string, string> }> = {
  wish,
}

export type ErrorModule = 'wish'
