import { Alert, Button, Chip, Skeleton } from '@mui/material'
import { initHapticFeedback } from '@tma.js/sdk'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { InfoEmoji } from '~/assets'
import { CategoryChip } from '~/components/category'
import { UserHeader } from '~/components/user'
import { WishItem } from '~/components/wish'
import { WishStatus } from '~/entities'
import { useTgBack } from '~/hooks'
import { DefaultLayout } from '~/layouts/default'
import { ONBOARDING_DATA_NAME, useAuth, useCustomization, useNotifyContext, useOnboarding } from '~/providers'
import { useUserCategoryDeleteMutation, useUserCategoryQuery, useUserWishQuery } from '~/query'
import { ROUTE } from '~/router'
import { cn } from '~/utils'

export const Home = () => {
  const { setNotify } = useNotifyContext()
  const haptic = initHapticFeedback()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useTgBack({
    defaultBackPath: location.state?.prevPage,
    isShowBackButton: !!location.state?.prevPage,
  })

  const { updateUserCustomizationId } = useCustomization()

  useEffect(() => {
    updateUserCustomizationId(user?.id)
  }, [user?.id, updateUserCustomizationId])

  const [selectedCategoryId, setSelectedCategory] = useState<string | undefined>(undefined)
  const [isGiven, setIsGiven] = useState<boolean>(false)

  const {
    data: wishlsit,
    isLoading,
    isError,
    key,
  } = useUserWishQuery(
    user?.id || '',
    { categoryId: selectedCategoryId?.trim?.(), status: isGiven ? WishStatus.GIVEN : WishStatus.ACTIVE },
    { enabled: !!user?.id },
  )

  const handlePickCategory = useCallback((categoryId: string) => {
    setSelectedCategory((selectedCategoryId) => (selectedCategoryId === categoryId ? undefined : categoryId))
  }, [])

  const handlePickGiven = useCallback(() => {
    setIsGiven((state) => !state)
  }, [])

  const handleAddWish = useCallback(() => {
    haptic.impactOccurred('soft')

    navigate(ROUTE.wishNew)
  }, [haptic, navigate])

  const handleAddCategory = useCallback(() => {
    navigate(ROUTE.categoryNew, { state: { prevPage: ROUTE.home }, replace: true })
  }, [navigate])

  const {
    data: categories,
    isLoading: isCategoryLoading,
    key: definedCategoryKey,
  } = useUserCategoryQuery(user?.id || '', !!user?.id)

  const selectedCategoryName = useMemo(
    () => categories?.find((category) => category.id === selectedCategoryId)?.name,
    [categories, selectedCategoryId],
  )

  const data = useMemo(
    () => (selectedCategoryId ? wishlsit?.filter((wish) => wish?.categoryId === selectedCategoryId) : wishlsit),
    [selectedCategoryId, wishlsit],
  )

  const isCategoryAvailable = useMemo(
    () => !!categories?.find((category) => category.id === selectedCategoryId),
    [categories, selectedCategoryId],
  )

  const deleteCategoryMutation = useUserCategoryDeleteMutation(definedCategoryKey)

  const handleDeleteCategory = useCallback(
    async (id?: string) => {
      if (!id) return

      try {
        await deleteCategoryMutation.mutate(id)
        setSelectedCategory(undefined)
        setNotify('Категория успешно удалена', { severity: 'success' })
        haptic.impactOccurred('soft')
      } catch {
        setNotify('Не удалось удалить категорию', { severity: 'error' })
        haptic.impactOccurred('heavy')
      }
    },
    [deleteCategoryMutation, haptic, setNotify],
  )

  const { handleStart } = useOnboarding()

  const filterEnabledText = useMemo(() => {
    let text = ''

    if (selectedCategoryId) {
      text = selectedCategoryName || ''
    }

    if (isGiven) {
      text = text?.length ? `${text} (подаренные)` : 'Подаренные'
    }

    return text
  }, [selectedCategoryId, isGiven, selectedCategoryName])

  return (
    <DefaultLayout className="!px-0 relative">
      <button
        type="button"
        onClick={handleStart}
        className="z-[10] absolute left-[12px] top-[12px] flex items-center justify-center bg-blue-600 rounded-[50%] p-2 text-white font-bold hover:opacity-[0.8] w-[32px] h-[32px]"
      >
        <InfoEmoji className="text-sm" />
      </button>
      <UserHeader className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4" categoryId={selectedCategoryId} />
      <div className="px-4">
        {filterEnabledText && (
          <div className="flex flex-col mt-4 items-start">
            <div className="text-xs font-bold p-1 bg-gray-200 text-slate-700 dark:text-slate-400 rounded-xl px-2 py-1">
              {filterEnabledText}
            </div>
          </div>
        )}
        <div className={cn('flex justify-between items-center pb-4', { 'py-4': !filterEnabledText })}>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">Желания</h3>
          <Button
            color="primary"
            data-tour={ONBOARDING_DATA_NAME.wishMainNewWish}
            type="button"
            onClick={handleAddWish}
            size="small"
            variant="text"
          >
            Добавить
          </Button>
        </div>

        <div className="mb-4 flex flex-wrap gap-3">
          <Chip
            label="Добавить"
            variant="filled"
            className={cn('dark:!text-slate-200 dark:!bg-slate-600')}
            data-tour={ONBOARDING_DATA_NAME.wishMainNewCategory}
            onClick={handleAddCategory}
          />
          <Chip
            label="Подаренные"
            variant={isGiven ? 'filled' : 'outlined'}
            className={cn('dark:!text-slate-200 dark:!bg-slate-600')}
            onClick={handlePickGiven}
          />
          {isCategoryLoading && (
            <>
              <Skeleton className="rounded-lg" variant="rectangular" width={100} height={32} />
              <Skeleton className="rounded-lg" variant="rectangular" width={100} height={32} />
              <Skeleton className="rounded-lg" variant="rectangular" width={100} height={32} />
            </>
          )}
          {!isCategoryLoading &&
            categories?.map((category) => (
              <CategoryChip
                key={category.id}
                category={category}
                selected={selectedCategoryId === category.id}
                onClick={handlePickCategory}
              />
            ))}
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
                <div className="flex flex-col gap-4">
                  <Alert
                    severity="info"
                    className="dark:!bg-slate-300"
                    action={
                      !isGiven && (
                        <Button color="primary" type="button" onClick={handleAddWish} size="small" variant="text">
                          Добавить
                        </Button>
                      )
                    }
                  >
                    {isGiven ? (
                      <>У вас еще нет ни одного подаренного желания</>
                    ) : (
                      <>
                        Вы еще не добавили ни одного желания {selectedCategoryId ? 'в выбранной категории' : ''},
                        давайте создадим?
                      </>
                    )}
                  </Alert>
                  {!!selectedCategoryId && isCategoryAvailable && !isError && (
                    <Alert
                      severity="warning"
                      className="dark:!bg-slate-300"
                      action={
                        <Button
                          color="primary"
                          type="button"
                          onClick={() => handleDeleteCategory(selectedCategoryId)}
                          size="small"
                          variant="text"
                          disabled={deleteCategoryMutation?.isLoading}
                        >
                          Удалить
                        </Button>
                      }
                    >
                      Так же вы можете удалить пустую категорию
                    </Alert>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DefaultLayout>
  )
}
