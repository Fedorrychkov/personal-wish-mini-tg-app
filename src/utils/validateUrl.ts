export const URL_REGEXP = /[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,256}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)?/gi

const urlPrefix = /[-a-zA-Z-0-9@:%._\\+~#=]{1,256}/gi

export const parseUrl = (url?: string | null) => {
  if (!url?.match(URL_REGEXP)) {
    return ''
  }

  const units = url?.match(urlPrefix)
  const hasValidUnits = units ? units?.length > 1 : false

  const hasSlashes = url?.includes('//')

  // example: https://youtube.com => ['https:', 'youtube']
  if (hasValidUnits) {
    return url
  }

  // example: //youtube.com => ['youtube']
  if (hasSlashes) {
    return `https://${url}`
  }

  // example: youtube.com
  if (!hasValidUnits && !hasSlashes) {
    return `https://${url}`
  }

  return ''
}
