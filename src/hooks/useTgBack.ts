import { initBackButton } from '@tma.js/sdk'
import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTE } from '~/router'

type Props = {
  backHandler?: () => void
  defaultBackPath?: string
}

export const useTgBack = (props?: Props) => {
  const { defaultBackPath, backHandler } = props || {}

  const [backButton] = initBackButton()
  const navigate = useNavigate()

  backButton.show()

  const handleBack = useCallback(() => {
    if (backHandler) {
      backHandler()

      return
    }

    const path = defaultBackPath ?? ROUTE.home

    navigate(path, { replace: true })

    return
  }, [backHandler, defaultBackPath, navigate])

  useEffect(() => {
    backButton.on('click', handleBack)

    return () => {
      backButton.off('click', handleBack)
    }
  }, [handleBack, backButton])
}
