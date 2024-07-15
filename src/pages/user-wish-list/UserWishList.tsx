import { Alert, Chip, Skeleton } from '@mui/material'
import { initBackButton } from '@tma.js/sdk'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { FavoriteContainer } from '~/components/favorite'
import { UserHeader } from '~/components/user'
import { WishItem } from '~/components/wish'
import { DefaultLayout } from '~/layouts/default'
import { useAuth, useCustomization } from '~/providers'
import { useUserCategoryQuery, useUserDataQuery, useUserFavoriteQuery, useUserWishQuery } from '~/query'
import { ROUTE } from '~/router'
import { cn } from '~/utils'

export const UserWishList = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const [backButton] = initBackButton()
  const { user: authUser } = useAuth()
  const { data: user, isLoading: isUserLoading } = useUserDataQuery(id || '', id, !!id)
  const { data: wishlsit, isLoading, key } = useUserWishQuery(id || '', !!id)

  const { updateUserCustomizationId } = useCustomization()

  useEffect(() => {
    updateUserCustomizationId(id)
  }, [id, updateUserCustomizationId])

  const categoryId = new URLSearchParams(location.search).get('categoryId')

  const [selectedCategoryId, setSelectedCategory] = useState<string | undefined>(categoryId || '')
  const [isMeBooked, setMeBooked] = useState(false)
  const [isUnbooked, setUnbooked] = useState(false)

  const handleToggleBookedFilter = () => {
    setMeBooked((state) => !state)
  }

  const handleToggleUnBookedFilter = () => {
    setUnbooked((state) => !state)
  }

  const handlePickCategory = useCallback((categoryId: string) => {
    setSelectedCategory((selectedCategoryId) => (selectedCategoryId === categoryId ? undefined : categoryId))
  }, [])

  backButton.show()

  const handleBack = useCallback(() => {
    navigate(location?.state?.prevPage ?? ROUTE.home, { replace: true })

    return
  }, [navigate, location])

  useEffect(() => {
    backButton.on('click', handleBack)

    return () => {
      backButton.off('click', handleBack)
    }
  }, [handleBack, backButton])

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

  const { data: categories, isLoading: isCategoryLoading } = useUserCategoryQuery(user?.id || '', !!user?.id)

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

  return (
    <DefaultLayout className="!px-0">
      <UserHeader
        user={user}
        isLoading={isUserLoading}
        className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4"
      />
      <div className="px-4">
        <div className="py-4 flex gap-4 justify-between">
          <h3 className="text-xl bold text-slate-900 dark:text-white mt-2">Желания</h3>
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
                <Chip
                  key={category.id}
                  label={category.name}
                  variant={selectedCategoryId === category.id ? undefined : 'outlined'}
                  className={cn('dark:!text-slate-200', {
                    'dark:!bg-slate-500': selectedCategoryId === category.id,
                  })}
                  onClick={() => handlePickCategory(category.id)}
                />
              ))
            : null}
          <Chip
            label="Я дарю"
            variant={isMeBooked ? undefined : 'outlined'}
            className={cn('dark:!text-slate-200', {
              'dark:!bg-slate-500': isMeBooked,
            })}
            onClick={() => {
              handleToggleBookedFilter()
              setUnbooked(false)
            }}
          />
          <Chip
            label="Никто не дарит"
            variant={isUnbooked ? undefined : 'outlined'}
            className={cn('dark:!text-slate-200', {
              'dark:!bg-slate-500': isUnbooked,
            })}
            onClick={() => {
              handleToggleUnBookedFilter()
              setMeBooked(false)
            }}
          />
        </div>

        <div className="w-full h-[1px] bg-gray-400" />

        <div className="mt-2 gap-4">
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
