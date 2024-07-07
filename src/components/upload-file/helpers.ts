import reduce from 'lodash/reduce'

export const getDropzoneAccept = (ext: string): Record<string, string[]> =>
  reduce(ext.split(','), (acc, key) => ({ ...acc, [key]: [] }), {})
