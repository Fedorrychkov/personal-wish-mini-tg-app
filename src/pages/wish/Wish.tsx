import { Button, Skeleton } from '@mui/material'
import { initBackButton, initHapticFeedback } from '@tma.js/sdk'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useWishDelete, WishForm, WishImageContainer } from '~/components/wish'
import { getBookButtonState } from '~/components/wish/helpers'
import { useWishBook } from '~/components/wish/hooks/useWishBook'
import { DefaultLayout } from '~/layouts/default'
import { useAuth } from '~/providers'
import { useUserDataQuery, useUserWishItemQuery, useWishCategoryQuery } from '~/query'
import { ROUTE } from '~/router'

export const Wish = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [backButton] = initBackButton()
  const haptic = initHapticFeedback()
  const { user } = useAuth()
  const [isEditable, setEditable] = useState(false)
  const { data: wish, isLoading, isFetched, key } = useUserWishItemQuery(id || '', `${user?.id}`)

  const [wishImage, setWishImage] = useState<File | undefined>()
  const [isDeleted, setDeleted] = useState(false)

  backButton.show()

  const handleBack = useCallback(() => {
    if (wish?.userId !== user?.id) {
      navigate(ROUTE.userWishList?.replace(':id', wish?.userId || ''), { replace: true })

      return
    }

    navigate(ROUTE.home, { replace: true })

    return
  }, [navigate, wish, user])

  useEffect(() => {
    backButton.on('click', handleBack)

    return () => {
      backButton.off('click', handleBack)
    }
  }, [handleBack, backButton])

  const { handleDeletePopup, isLoading: isDeletionLoading } = useWishDelete(wish, '', () => {
    navigate(ROUTE.home, { replace: true })
  })

  const { data: category, isLoading: isLoadingCategory } = useWishCategoryQuery(
    wish?.categoryId || '',
    !!wish?.categoryId,
  )

  const { handleBookPopup, isLoading: isBookingLoading } = useWishBook(wish, key || '')

  const isOwner = user?.id === wish?.userId
  const { data: wishUserOwner } = useUserDataQuery(wish?.userId || '', wish?.userId, !isOwner)

  const { disabled: bookBtnDisabled, text: bookBtnText } = getBookButtonState(wish, user)

  return (
    <DefaultLayout className="!px-0">
      {isLoading ? (
        <>
          <Skeleton height={200} width="100%" className="bg-gray-200 dark:bg-slate-400 !scale-x-[1] !scale-y-[1]" />
          <div className="px-4">
            <div className="py-4">
              <Skeleton className="mt-1" variant="rectangular" width={100} height={20} />
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
          <WishImageContainer
            onSaveImage={setWishImage}
            isEditable={isEditable}
            wish={wish}
            onDeleted={setDeleted}
            isLoading={!wish || isLoading || !isFetched}
          />
          <div className="px-4">
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
                <div className="py-4">
                  <div className="gap-4 mt-1 flex items-baseline">
                    <div className="text-sm bold text-slate-700 dark:text-slate-400">
                      {isOwner ? 'Мое желание' : `Желание пользователя @${wishUserOwner?.username}`}
                    </div>
                    {wish?.isBooked ? (
                      <div className="text-xs p-1 bg-gray-200 text-slate-700 dark:text-slate-400">
                        {wish?.bookedUserId === user?.id ? 'забронировано вами' : 'забронировано'}
                      </div>
                    ) : null}
                  </div>
                  {(category || isLoadingCategory) && (
                    <div className="flex my-2">
                      {isLoadingCategory ? (
                        <Skeleton className="mt-1 rounded-md" variant="rectangular" width={100} height={20} />
                      ) : (
                        <div className="text-xs bold p-2 bg-gray-200 text-slate-700 dark:text-slate-800 rounded-md">
                          {category.name}
                        </div>
                      )}
                    </div>
                  )}
                  <h3 className="text-xl bold text-slate-900 dark:text-white mt-2">{wish?.name || 'Без названия'}</h3>
                </div>
                <div className="w-full h-[1px] bg-gray-400" />
                <div className="mt-2 gap-4">
                  <p className="text-sm bold text-slate-900 dark:text-white mt-2 whitespace-pre-wrap">
                    {wish?.description || 'Без Описания'}
                  </p>
                </div>

                <div className="w-full h-[1px] bg-gray-400 my-2" />
                <div className="gap-4 mt-2 flex justify-between">
                  {isOwner ? (
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
                        onClick={handleDeletePopup}
                        disabled={isLoading || isDeletionLoading || isBookingLoading}
                      >
                        Удалить
                      </Button>
                    </>
                  ) : null}

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
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </DefaultLayout>
  )
}
