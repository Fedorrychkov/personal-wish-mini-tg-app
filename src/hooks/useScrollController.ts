export const useScrollController = (definedScrollEndpoint?: string, definedHeaderOffset?: number) => {
  const scrollToHash = function (scrollEndpoint?: string, headerOffsetParam?: number) {
    const element = document?.querySelector?.(`[${scrollEndpoint || definedScrollEndpoint || ''}]`)

    if (!element) return

    const headerOffset = headerOffsetParam || definedHeaderOffset || 0
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + (window.pageYOffset || window.scrollY) - headerOffset

    setTimeout(() => {
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }, 100)
  }

  return { scrollToHash }
}
