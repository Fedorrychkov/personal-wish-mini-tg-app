import { initBackButton } from '@tma.js/sdk'
import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTE } from '~/router'

type Props = {
  backHandler?: () => void
  defaultBackPath?: string
  isShowBackButton?: boolean
}

export const useTgBack = (props?: Props) => {
  const { defaultBackPath, backHandler, isShowBackButton = true } = props || {}

  const [backButton] = initBackButton()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isShowBackButton) {
      backButton.hide()
    } else {
      backButton.show()
    }
  }, [isShowBackButton, backButton])

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
