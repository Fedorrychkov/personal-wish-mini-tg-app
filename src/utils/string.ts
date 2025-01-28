export const convertTextToShort = (acc: string, size = 4) => {
  if (acc.length > 5) {
    return `${acc.slice(0, size)}...${acc.slice(-size)}`
  }

  return acc
}
