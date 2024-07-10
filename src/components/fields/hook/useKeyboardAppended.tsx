import { useCallback } from 'react'

const foundContainer = () => {
  const element = document?.querySelector('[id="keyboard-appended"]')

  if (element instanceof HTMLDivElement) {
    return element
  }

  return null
}

export const useKeyboardAppended = () => {
  const focusHandler = useCallback(() => {
    const container = foundContainer()

    container?.style?.setProperty('height', '300px')
  }, [])

  const blurHandler = useCallback(() => {
    const container = foundContainer()

    container?.style?.setProperty('height', '0px')
  }, [])

  return {
    focusHandler,
    blurHandler,
  }
}
