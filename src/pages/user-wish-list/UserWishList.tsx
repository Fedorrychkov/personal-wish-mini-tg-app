import { Alert, Chip, Skeleton } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { CategoryChip } from '~/components/category'
import { FavoriteContainer } from '~/components/favorite'
import { UserHeader } from '~/components/user'
import { WishItem } from '~/components/wish'
import { transactionCurrencyLabels } from '~/entities'
import { useTgBack } from '~/hooks'
import { DefaultLayout } from '~/layouts/default'
import { useAuth, useCustomization } from '~/providers'
import { useUserCategoryQuery, useUserDataQuery, useUserFavoriteQuery, useUserWishQuery } from '~/query'
import { ROUTE } from '~/router'
import { cn } from '~/utils'

export const UserWishList = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const { user: authUser } = useAuth()
  const { data: user, isLoading: isUserLoading } = useUserDataQuery(id || '', id, !!id)
  const { updateUserCustomizationId } = useCustomization()

  useTgBack({
    defaultBackPath: location?.state?.prevPage ?? ROUTE.home,
  })

  useEffect(() => {
    updateUserCustomizationId(id)
  }, [id, updateUserCustomizationId])

  const categoryId = new URLSearchParams(location.search).get('categoryId')?.trim?.()

  const [selectedCategoryId, setSelectedCategory] = useState<string | undefined>('')
  const [isMeBooked, setMeBooked] = useState(false)
  const [isUnbooked, setUnbooked] = useState(false)

  const { data: categories, isLoading: isCategoryLoading } = useUserCategoryQuery(user?.id || '', !!user?.id)

  useEffect(() => {
    const availableCatId = categories?.find((category) => category.id === categoryId)?.id

    if (!selectedCategoryId && availableCatId) {
      setSelectedCategory(availableCatId)
    }
  }, [selectedCategoryId, categories, categoryId])

  const {
    data: wishlsit,
    isLoading,
    key,
  } = useUserWishQuery(id || '', { categoryId: selectedCategoryId }, { enabled: !!id })

  const handleToggleBookedFilter = () => {
    setMeBooked((state) => !state)
  }

  const handleToggleUnBookedFilter = () => {
    setUnbooked((state) => !state)
  }

  const handlePickCategory = useCallback((categoryId: string) => {
    setSelectedCategory((selectedCategoryId) => (selectedCategoryId === categoryId ? undefined : categoryId))
  }, [])

  const {
    data: favoriteState,
    isLoading: isFavoriteLoading,
    key: definedFavoriteKey,
  } = useUserFavoriteQuery(
    {
      favoriteUserId: user?.id || '',
      userId: authUser?.id || '',
    },
    !!user?.id && !!authUser?.id,
  )

  const data = useMemo(() => {
    const selectedCategoryList = selectedCategoryId
      ? wishlsit?.filter((wish) => wish?.categoryId === selectedCategoryId)
      : wishlsit

    const filreredBookedWishlist = isMeBooked
      ? selectedCategoryList?.filter((wish) => wish.isBooked && wish.bookedUserId === authUser?.id)
      : selectedCategoryList

    const filreredUnBookedWishlist = isUnbooked
      ? filreredBookedWishlist?.filter((wish) => !wish.isBooked)
      : filreredBookedWishlist

    return filreredUnBookedWishlist
  }, [selectedCategoryId, wishlsit, authUser?.id, isMeBooked, isUnbooked])

  const selectedCategoryName = useMemo(
    () => categories?.find((category) => category.id === selectedCategoryId)?.name,
    [categories, selectedCategoryId],
  )

  const filterEnabledText = useMemo(() => {
    let text = ''

    if (selectedCategoryId) {
      text = selectedCategoryName || ''
    }

    if (isMeBooked) {
      text = text?.length ? `${text} (я дарю)` : 'Я дарю'
    }

    if (isUnbooked) {
      text = text?.length ? `${text} (никто не дарит)` : 'Никто не дарит'
    }

    return text
  }, [selectedCategoryId, selectedCategoryName, isMeBooked, isUnbooked])

  return (
    <DefaultLayout className="!px-0">
      <UserHeader
        user={user}
        isLoading={isUserLoading}
        className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4"
      />
      <div className="px-4">
        {filterEnabledText && (
          <div className="flex flex-col mt-4 items-start">
            <div className="text-xs font-bold p-1 bg-gray-200 text-slate-700 dark:text-slate-400 rounded-xl px-2 py-1">
              {filterEnabledText}
            </div>
          </div>
        )}
        <div className={cn('flex justify-between items-center pb-4 mt-2', { 'py-4': !filterEnabledText })}>
          <h3 className="text-xl bold text-slate-900 dark:text-white">Желания</h3>
          <FavoriteContainer
            favoriteUser={user}
            definedKey={definedFavoriteKey}
            isLoading={isFavoriteLoading}
            favorite={favoriteState}
          />
        </div>

        <div className="mb-4 flex flex-wrap gap-3">
          {isCategoryLoading && (
            <>
              <Skeleton className="rounded-lg" variant="rectangular" width={100} height={32} />
              <Skeleton className="rounded-lg" variant="rectangular" width={100} height={32} />
              <Skeleton className="rounded-lg" variant="rectangular" width={100} height={32} />
            </>
          )}
          {!isCategoryLoading
            ? categories?.map((category) => (
                <CategoryChip
                  key={category.id}
                  category={category}
                  selected={selectedCategoryId === category.id}
                  onClick={handlePickCategory}
                />
              ))
            : null}
          <Chip
            label="Я дарю"
            variant={isMeBooked ? 'outlined' : undefined}
            className={cn(
              'dark:!text-slate-200 !bg-slate-200/[.5] dark:!bg-slate-900/[.5] hover:!bg-slate-200 dark:hover:!bg-slate-900',
              {
                'dark:!bg-slate-800 !bg-slate-200': isMeBooked,
              },
            )}
            onClick={() => {
              handleToggleBookedFilter()
              setUnbooked(false)
            }}
          />
          <Chip
            label="Никто не дарит"
            variant={isUnbooked ? 'outlined' : undefined}
            className={cn(
              'dark:!text-slate-200 !bg-slate-200/[.5] dark:!bg-slate-900/[.5] hover:!bg-slate-200 dark:hover:!bg-slate-900',
              {
                'dark:!bg-slate-800 !bg-slate-200': isUnbooked,
              },
            )}
            onClick={() => {
              handleToggleUnBookedFilter()
              setMeBooked(false)
            }}
          />
          <Chip
            label={`Подарить ${transactionCurrencyLabels['XTR']}`}
            variant="filled"
            className="!bg-blue-600 dark:!bg-blue-500 !text-white font-bold"
            onClick={() => {
              navigate(ROUTE.transferToUser?.replace(':userId', user?.id || ''), {
                state: {
                  prevPage: ROUTE.userWishList?.replace(':id', user?.id || ''),
                },
              })
            }}
          />
        </div>

        <div className="w-full h-[1px] bg-gray-400" />

        <div className="mt-2 gap-4" data-scroll-container="wish-list">
          {isLoading ? (
            <>
              <Skeleton className="mb-4 rounded-lg" variant="rectangular" width="100%" height={118} />
              <Skeleton className="mb-4 rounded-lg" variant="rectangular" width="100%" height={118} />
              <Skeleton className="mb-4 rounded-lg" variant="rectangular" width="100%" height={118} />
            </>
          ) : (
            <>
              {data?.length ? (
                data?.map((wish) => (
                  <WishItem
                    categories={categories}
                    onFilterByCategoryId={() => handlePickCategory(wish?.categoryId || '')}
                    className="mb-4"
                    key={wish.id}
                    listKey={key}
                    wish={wish}
                  />
                ))
              ) : (
                <div>
                  <Alert severity="info" className="dark:!bg-slate-300">
                    @{user?.username || user?.id} еще не добавил ни одного желания{' '}
                    {selectedCategoryId ? 'в выбранной категории' : ''}
                  </Alert>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DefaultLayout>
  )
}
