import { Button, Skeleton } from '@mui/material'
import { initHapticFeedback } from '@tma.js/sdk'
import { AxiosError } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { DeleteEmoji, OpenEmoji, ShareEmoji } from '~/assets'
import { TransactionUserItem } from '~/components/history'
import {
  useWishBookedInfoPurchase,
  useWishCopy,
  useWishDelete,
  useWishGiven,
  WishForm,
  WishImageContainer,
} from '~/components/wish'
import { getBookButtonState } from '~/components/wish/helpers'
import { useWishBook } from '~/components/wish/hooks/useWishBook'
import { TRANSACTION_BOOKED_USERS_XTR_AMOUNT, TRANSACTION_DEPOSIT_COMISSION_NUMBER } from '~/constants'
import { transactionCurrencyLabels, TransactionPayloadType, WishStatus } from '~/entities'
import { getErrorMessageByCode } from '~/errors'
import { useTgBack } from '~/hooks'
import { DefaultLayout } from '~/layouts/default'
import { useAuth, useCustomization, useNotifyContext } from '~/providers'
import {
  usePurchaseTransactionQuery,
  useTransactionUserBalanceQuery,
  useUserDataQuery,
  useUserWishItemQuery,
  useWishCategoryQuery,
} from '~/query'
import { ROUTE } from '~/router'
import { shareTgLink } from '~/utils'

export const Wish = () => {
  const { setNotify } = useNotifyContext()
  const { id } = useParams()
  const navigate = useNavigate()
  const haptic = initHapticFeedback()
  const { user } = useAuth()
  const [isEditable, setEditable] = useState(false)
  const [isBookedUsersOpenFlow, setBookedUsersOpenFlow] = useState(false)
  const [isBookedUserOpen, setBookedUserOpen] = useState(false)
  const [balanceNotEnough, setBalanceNotEnough] = useState(false)
  const {
    isLoading: isPurchaseLoading,
    refetch: refetchPurchases,
    key: purchaseKey,
  } = usePurchaseTransactionQuery(
    {
      wishId: id || '',
      userId: user?.id || '',
    },
    !!id && !!user?.id,
    {
      onSuccess: (transactions) => {
        if (transactions?.length) {
          setBookedUserOpen(true)
          setBookedUsersOpenFlow(false)
          setBalanceNotEnough(false)
        }
      },
    },
  )

  const { handlePopup } = useWishBookedInfoPurchase(purchaseKey, () => {
    refetchPurchases()
  })

  const { isLoading: isBalanceLoading, refetch: refetchUserBalance } = useTransactionUserBalanceQuery(
    !!user?.id && isBookedUsersOpenFlow,
    {
      onSuccess: (balance) => {
        const balanceXTR = balance?.find((item) => item.currency === 'XTR')

        if (balanceXTR?.amount && Number(balanceXTR?.amount) >= TRANSACTION_BOOKED_USERS_XTR_AMOUNT) {
          handlePopup({
            wishId: id || '',
            payload: {
              type: TransactionPayloadType.SHOW_WISH_BOOKED_USER,
              message: 'Оплата услуги за просмотр кто подарил/забронировал желание',
            },
            amount: TRANSACTION_BOOKED_USERS_XTR_AMOUNT.toString(),
            currency: 'XTR',
          })

          return
        }

        setBookedUsersOpenFlow(false)
        setBalanceNotEnough(true)
      },
    },
  )

  const {
    data: wish,
    isLoading,
    isFetched,
    isError,
    key,
  } = useUserWishItemQuery(id || '', `${user?.id}`, !!id && !!user?.id, {
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        const message = getErrorMessageByCode(error?.response?.data?.code)

        setNotify(message, { severity: 'error' })
      }

      setTimeout(() => {
        navigate(ROUTE.home, { replace: true })
      }, 1000)
    },
  })

  const isUnavailable = isLoading || isError

  const [wishImage, setWishImage] = useState<File | undefined>()
  const [isDeleted, setDeleted] = useState(false)

  useTgBack({
    backHandler: () => {
      if (wish && wish?.userId !== user?.id) {
        navigate(ROUTE.userWishList?.replace(':id', wish?.userId || ''), { replace: true })

        return
      }

      navigate(ROUTE.home, { replace: true })

      return
    },
  })

  const { handleDeletePopup, isLoading: isDeletionLoading } = useWishDelete(wish, '', () => {
    navigate(ROUTE.home, { replace: true })
  })

  const { handleGivenPopup, isLoading: isGivenLoading } = useWishGiven(wish, key || '')

  const { data: category, isLoading: isLoadingCategory } = useWishCategoryQuery(
    wish?.categoryId || '',
    !!wish?.categoryId,
  )

  const { handleBookPopup, isLoading: isBookingLoading } = useWishBook(wish, key || '')

  const { handleCopyPopup, isLoading: isCopyLoading } = useWishCopy(wish, (wish) => {
    navigate(ROUTE.wish?.replace(':id', wish?.id || ''))
  })

  const isOwner = user?.id === wish?.userId
  const { data: wishUserOwner } = useUserDataQuery(wish?.userId || '', wish?.userId, !isOwner)

  const { updateUserCustomizationId } = useCustomization()

  useEffect(() => {
    updateUserCustomizationId(wish?.userId)
  }, [wish?.userId, updateUserCustomizationId])

  const { disabled: bookBtnDisabled, text: bookBtnText } = getBookButtonState(wish, user)

  const handleShare = useCallback(() => {
    const payload = JSON.stringify({ wId: wish?.id })

    shareTgLink(payload)
  }, [wish?.id])

  const handleOpenCategory = useCallback(() => {
    navigate(ROUTE?.category?.replace(':id', category?.id || ''), {
      state: { prevPage: ROUTE.wish?.replace(':id', wish?.id || '') },
    })
  }, [navigate, category?.id, wish?.id])

  const handleShowBookedUsers = useCallback(() => {
    setBookedUsersOpenFlow((state) => {
      if (state) {
        refetchUserBalance()
      }

      return true
    })
  }, [refetchUserBalance])

  return (
    <DefaultLayout className="!px-0">
      {isUnavailable ? (
        <>
          <Skeleton height={200} width="100%" className="bg-gray-200 dark:bg-slate-400 !scale-x-[1] !scale-y-[1]" />
          <div className="px-4">
            <div className="py-4">
              <Skeleton className="mt-1" variant="rectangular" width={100} height={20} />
              <Skeleton className="mt-1" variant="rectangular" width={80} height={20} />
              <Skeleton className="mt-2" variant="rectangular" width={200} height={28} />
            </div>
            <div className="w-full h-[1px] bg-gray-400" />

            <div className="mt-2 gap-4">
              <Skeleton className="mt-2" variant="rectangular" width="100%" height={60} />
            </div>
            <div className="w-full h-[1px] bg-gray-400 my-2" />
            <div className="gap-4 mt-2 flex justify-between">
              <Skeleton className="mt-2" variant="rectangular" width={80} height={30} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="relative">
            <WishImageContainer
              onSaveImage={setWishImage}
              isEditable={isEditable}
              wish={wish}
              onDeleted={setDeleted}
              isLoading={!wish || isLoading || !isFetched}
            />

            {isOwner && !isEditable && wish?.status !== WishStatus.GIVEN && (
              <Button
                color="error"
                size="small"
                type="button"
                variant="contained"
                className="!p-0 !min-w-0 max-w-[24px] h-[24px] w-full !bg-red-200 !rounded-full !absolute top-2 right-2"
                onClick={handleDeletePopup}
                disabled={isLoading || isDeletionLoading || isBookingLoading}
              >
                <DeleteEmoji />
              </Button>
            )}
          </div>
          <div>
            {isEditable ? (
              <WishForm
                wish={wish}
                wishImage={wishImage}
                definedKey={key}
                isImageDeleted={isDeleted}
                onCancel={() => {
                  setEditable(false)
                  haptic.impactOccurred('soft')
                }}
              />
            ) : (
              <div className="pb-4 pt-0">
                <div className="p-4 bg-slate-200/[.5] dark:bg-slate-900/[.5]">
                  <div className="gap-4 mt-1 flex items-baseline">
                    <div className="text-sm bold text-slate-700 dark:text-slate-400">
                      {isOwner
                        ? 'Мое желание'
                        : `Желание пользователя @${wishUserOwner?.username || wishUserOwner?.id}`}
                    </div>
                    {wish?.isBooked ? (
                      <div className="text-xs p-1 bg-gray-200 text-slate-700 dark:text-slate-400">
                        {wish?.bookedUserId === user?.id ? 'забронировано вами' : 'забронировано'}
                      </div>
                    ) : null}
                    {wish?.status === WishStatus.GIVEN && (
                      <div className="text-xs p-1 bg-gray-200 text-slate-700 dark:text-slate-400">Выполнено</div>
                    )}

                    <button
                      type="button"
                      className="border-none bg-slate-200 dark:bg-slate-300 rounded-[50%] w-[40px] h-[40px] hover:opacity-[0.8]"
                      title="Поделиться"
                      onClick={handleShare}
                    >
                      <ShareEmoji />
                    </button>
                  </div>
                  {(category || isLoadingCategory) && (
                    <div className="flex my-2">
                      {isLoadingCategory ? (
                        <Skeleton className="mt-1 rounded-md" variant="rectangular" width={100} height={20} />
                      ) : (
                        <>
                          {isOwner ? (
                            <button
                              onClick={handleOpenCategory}
                              type="button"
                              className="flex text-xs p-2 bg-gray-200 dark:bg-gray-800 text-slate-700 dark:text-slate-800 rounded-md gap-1 items-center"
                              key={category.id}
                            >
                              <div className="flex flex-1 flex-col items-start">
                                <p className="text-sm text-blue-500 dark:text-blue-200">{category.name}</p>
                                <p className="text-sm text-slate-900 dark:text-white">
                                  {category?.isPrivate ? '(приватная, по приглашению)' : ''}
                                </p>
                              </div>
                              <OpenEmoji />
                            </button>
                          ) : (
                            <div className="text-xs p-2 bg-gray-200 text-slate-700 dark:text-slate-800 rounded-md">
                              {category.name}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                  {wish?.link && (
                    <a
                      href={wish?.link?.includes('http') ? wish?.link : `//${wish?.link}`}
                      className="text-md text-blue-500 dark:text-blue-200 mt-2"
                      target="_blank"
                    >
                      Ссылка на желание
                    </a>
                  )}
                  <h3 className="text-xl bold text-slate-900 dark:text-white mt-2">{wish?.name || 'Без названия'}</h3>
                </div>
                <div className="w-full h-[1px] bg-gray-400" />
                <div className="mt-2 gap-4 p-4 bg-slate-200/[.5] dark:bg-slate-900/[.5]">
                  <p className="text-sm bold text-slate-900 dark:text-white mt-2 whitespace-pre-wrap">
                    {wish?.description || 'Без Описания'}
                  </p>
                </div>

                <div className="w-full h-[1px] bg-gray-400 my-2" />
                <div className="gap-1 mt-2 flex flex-col justify-between p-4 bg-slate-200/[.5] dark:bg-slate-900/[.5]">
                  {isOwner && wish?.status !== WishStatus.GIVEN && (
                    <>
                      <Button
                        color="primary"
                        size="small"
                        type="button"
                        variant="text"
                        onClick={() => {
                          setEditable(true)
                          window?.scrollTo?.(0, 0)
                          haptic.impactOccurred('medium')
                        }}
                        disabled={isLoading || isDeletionLoading || isBookingLoading}
                      >
                        Редактировать
                      </Button>

                      <Button
                        color="error"
                        size="small"
                        type="button"
                        variant="text"
                        onClick={handleGivenPopup}
                        disabled={isLoading || isDeletionLoading || isBookingLoading || isGivenLoading}
                      >
                        Подарили
                      </Button>
                    </>
                  )}

                  {wish?.status !== WishStatus.GIVEN && (
                    <Button
                      color="primary"
                      type="button"
                      size="small"
                      variant="text"
                      onClick={handleBookPopup}
                      disabled={bookBtnDisabled || isBookingLoading}
                    >
                      {bookBtnText}
                    </Button>
                  )}
                  {isOwner && wish?.status === WishStatus.GIVEN && (
                    <Button
                      color="error"
                      type="button"
                      disabled={isCopyLoading}
                      onClick={handleCopyPopup}
                      size="small"
                      variant="text"
                    >
                      Повторить желание
                    </Button>
                  )}
                  {!isOwner && (
                    <Button
                      color="error"
                      type="button"
                      disabled={isCopyLoading}
                      onClick={handleCopyPopup}
                      size="small"
                      variant="text"
                    >
                      Хочу себе
                    </Button>
                  )}
                  {wish?.bookedUserId && wish?.bookedUserId !== user?.id && (
                    <>
                      {isBookedUserOpen ? (
                        <div className="flex flex-col gap-2 items-center justify-center">
                          <div className="text-sm text-center text-slate-600 dark:text-slate-600 flex flex-col items-center justify-center gap-1">
                            <span>{wish.status === WishStatus.GIVEN ? 'Подарил' : 'Забронировал'}</span>
                            <Link
                              to={ROUTE.userWishList?.replace(':id', wish?.bookedUserId || '')}
                              className="text-sm text-center flex items-center justify-center gap-2 text-blue-700 dark:text-blue-700"
                            >
                              <TransactionUserItem userId={wish?.bookedUserId} showMeta />
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <Button
                          color="error"
                          type="button"
                          disabled={isLoading || isBalanceLoading || isPurchaseLoading}
                          onClick={handleShowBookedUsers}
                          size="small"
                          variant="text"
                        >
                          Посмотреть кто {wish.status === WishStatus.GIVEN ? 'подарил' : 'забронировал'} за{' '}
                          {TRANSACTION_BOOKED_USERS_XTR_AMOUNT} {transactionCurrencyLabels['XTR']}
                        </Button>
                      )}
                      {balanceNotEnough && (
                        <div className="flex flex-col gap-2 items-center justify-center">
                          <p className="text-xs text-center text-red-700 dark:text-red-400">
                            Баланс не достаточен для просмотра того, кто{' '}
                            {wish.status === WishStatus.GIVEN ? 'подарил' : 'забронировал'} желание
                          </p>
                          <Link
                            to={ROUTE.deposit}
                            state={{
                              prevPage: ROUTE.wish?.replace(':id', wish?.id || ''),
                              amount:
                                TRANSACTION_BOOKED_USERS_XTR_AMOUNT +
                                10 +
                                TRANSACTION_BOOKED_USERS_XTR_AMOUNT * TRANSACTION_DEPOSIT_COMISSION_NUMBER,
                            }}
                            className="text-sm text-center text-blue-700 dark:text-blue-700"
                          >
                            Пополнить баланс
                          </Link>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </DefaultLayout>
  )
}
