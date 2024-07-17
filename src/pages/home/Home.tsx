import { Alert, Button, Chip, Skeleton } from '@mui/material'
import { initBackButton, initHapticFeedback } from '@tma.js/sdk'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CategoryChip } from '~/components/category'
import { UserHeader } from '~/components/user'
import { WishItem } from '~/components/wish'
import { DefaultLayout } from '~/layouts/default'
import { useAuth, useCustomization, useNotifyContext } from '~/providers'
import { useUserCategoryDeleteMutation, useUserCategoryQuery, useUserWishQuery } from '~/query'
import { ROUTE } from '~/router'
import { cn } from '~/utils'

export const Home = () => {
  const { setNotify } = useNotifyContext()
  const [backButton] = initBackButton()
  const haptic = initHapticFeedback()
  const { user } = useAuth()
  const navigate = useNavigate()

  const { updateUserCustomizationId } = useCustomization()

  useEffect(() => {
    updateUserCustomizationId(user?.id)
  }, [user?.id, updateUserCustomizationId])

  const [selectedCategoryId, setSelectedCategory] = useState<string | undefined>(undefined)

  const {
    data: wishlsit,
    isLoading,
    isError,
    key,
  } = useUserWishQuery(user?.id || '', { categoryId: selectedCategoryId?.trim?.() }, { enabled: !!user?.id })

  const handlePickCategory = useCallback((categoryId: string) => {
    setSelectedCategory((selectedCategoryId) => (selectedCategoryId === categoryId ? undefined : categoryId))
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

  backButton.hide()

  return (
    <DefaultLayout className="!px-0">
      <UserHeader className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4" categoryId={selectedCategoryId} />
      <div className="px-4">
        <div className="py-4 flex justify-between items-center">
          <h3 className="text-xl bold text-slate-900 dark:text-white mt-2">Желания</h3>
          <Button color="primary" type="button" onClick={handleAddWish} size="small" variant="text">
            Добавить
          </Button>
        </div>

        {isCategoryLoading || categories?.length ? (
          <div className="mb-4 flex flex-wrap gap-3">
            <Chip
              label="Добавить"
              variant="filled"
              className={cn('dark:!text-slate-200')}
              onClick={handleAddCategory}
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
        ) : null}

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
                <div className="flex flex-col gap-4">
                  <Alert
                    severity="info"
                    className="dark:!bg-slate-300"
                    action={
                      <Button color="primary" type="button" onClick={handleAddWish} size="small" variant="text">
                        Добавить
                      </Button>
                    }
                  >
                    Вы еще не добавили ни одного желания {selectedCategoryId ? 'в выбранной категории' : ''}, давайте
                    создадим?
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
