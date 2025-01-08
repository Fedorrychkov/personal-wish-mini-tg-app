import { initHapticFeedback, initPopup } from '@tma.js/sdk'
import { AxiosError } from 'axios'

import { Purchase } from '~/entities'
import { getErrorMessageByCode, SupportedErrorCodes } from '~/errors'
import { useNotifyContext } from '~/providers'
import { usePurchaseTransactionMutation } from '~/query'

export const useWishBookedInfoPurchase = (listKey?: string, onSuccess?: () => void) => {
  const popup = initPopup()
  const haptic = initHapticFeedback()
  const { setNotify } = useNotifyContext()

  const purchaseMutation = usePurchaseTransactionMutation(listKey)

  const isLoading = purchaseMutation?.isLoading

  const handleAct = async (payload: Purchase) => {
    try {
      if (!payload?.wishId) {
        setNotify('Что то пошло не так, попробуйте позже', {
          severity: 'error',
        })

        return
      }

      await purchaseMutation.mutateAsync(payload)
      haptic.impactOccurred('medium')
      onSuccess?.()
      setNotify('Услуга успешно оплачена, вы всегда сможете увидеть, кто дарит/бронирует это желание', {
        severity: 'success',
      })
    } catch (error) {
      let message = 'Что то пошло не так, попробуйте позже'
      let code: SupportedErrorCodes | undefined

      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message
        code = error.response?.data?.code
      }

      setNotify(getErrorMessageByCode(code, message), {
        severity: 'error',
      })

      haptic.impactOccurred('heavy')
    }
  }

  const getPopupMessages = () => {
    return {
      title: 'Вы уверены, что хотите оплатить услугу?',
      message: 'Вы сможете увидеть того, кто подарил или забронировал желание. Оплату нельзя будет отменить!',
    }
  }

  const handlePopup = (payload: Purchase) => {
    const { title, message } = getPopupMessages()

    popup
      .open({
        title,
        message,
        buttons: [
          { id: 'ok', type: 'default', text: 'Оплатить' },
          { id: 'cancel', type: 'destructive', text: 'Отмена' },
        ],
      })
      .then((buttonId) => {
        if (!buttonId || buttonId === 'cancel') {
          return
        }

        handleAct(payload)
      })
  }

  return {
    handlePopup,
    isLoading,
  }
}
