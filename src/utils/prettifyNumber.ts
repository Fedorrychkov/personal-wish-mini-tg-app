export const prettifyNumber = (num?: string | number | null) => {
  if (!num) return ''

  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

  return parts.join('.')
}
