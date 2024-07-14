export const getBackgroundStyle = (name?: string) => {
  if (!name) {
    return undefined
  }

  return {
    backgroundImage: `url("/custom/tg/${name}.svg")`,
  }
}

export const getPatterns = () => {
  const entries = [...Array.from({ length: 33 }, (_, i) => i + 1)].map((item) => `pattern-${item}`)

  return entries
}
