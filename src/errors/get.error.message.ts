import { ErrorModule, ERRORS, SupportedErrorCodes } from './errors'

export const getErrorMessageByCode = (code: SupportedErrorCodes, defaultError?: string, module?: ErrorModule) => {
  let errorCodes: Record<string, string> = {}

  const defaultErrorText =
    typeof defaultError !== 'undefined' ? defaultError : 'Произошла непредвиденная ошибка, свяжитесь с поддержкой'

  if (!code) {
    return defaultErrorText
  }

  for (const moduleKey in ERRORS) {
    if (!(moduleKey in ERRORS)) {
      continue
    }

    const codes = ERRORS[moduleKey].TRANSLATIONS

    errorCodes = {
      ...errorCodes,
      ...codes,
    }
  }

  if (!errorCodes?.[code]) {
    console.error(`Передан не существующий код ошибки, ${code}`)
  }

  if (module) {
    return ERRORS?.[module]?.TRANSLATIONS[code] || defaultErrorText
  }

  return errorCodes?.[code] || defaultErrorText
}
