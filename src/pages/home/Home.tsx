import { Alert, Button, Chip, Skeleton } from '@mui/material'
import { initBackButton, initHapticFeedback } from '@tma.js/sdk'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { UserHeader } from '~/components/user'
import { WishItem } from '~/components/wish'
import { DefaultLayout } from '~/layouts/default'
import { useAuth } from '~/providers'
import { useUserCategoryQuery, useUserWishQuery } from '~/query'
import { ROUTE } from '~/router'
import { cn } from '~/utils'

export const Home = () => {
  const [backButton] = initBackButton()
  const haptic = initHapticFeedback()
  const { user } = useAuth()
  const { data: wishlsit, isLoading, key } = useUserWishQuery(user?.id || '', !!user?.id)
  const navigate = useNavigate()

  const [selectedCategoryId, setSelectedCategory] = useState<string | undefined>(undefined)

  const handlePickCategory = useCallback((categoryId: string) => {
    setSelectedCategory((selectedCategoryId) => (selectedCategoryId === categoryId ? undefined : categoryId))
  }, [])

  const handleAddWish = useCallback(() => {
    haptic.impactOccurred('soft')

    navigate(ROUTE.wishNew)
  }, [haptic, navigate])

  const { data: categories, isLoading: isCategoryLoading } = useUserCategoryQuery(user?.id || '', !!user?.id)

  const data = useMemo(
    () => (selectedCategoryId ? wishlsit?.filter((wish) => wish?.categoryId === selectedCategoryId) : wishlsit),
    [selectedCategoryId, wishlsit],
  )

  backButton.hide()

  return (
    <DefaultLayout className="!px-0">
      <UserHeader className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4" />
      <div className="px-4">
        <div className="py-4 flex justify-between items-center">
          <h3 className="text-xl bold text-slate-900 dark:text-white mt-2">Желания</h3>
          <Button color="primary" type="button" onClick={handleAddWish} size="small" variant="text">
            Добавить
          </Button>
        </div>

        {isCategoryLoading || categories?.length ? (
          <div className="mb-4 flex flex-wrap gap-3">
            {isCategoryLoading && (
              <>
                <Skeleton className="rounded-lg" variant="rectangular" width={100} height={32} />
                <Skeleton className="rounded-lg" variant="rectangular" width={100} height={32} />
                <Skeleton className="rounded-lg" variant="rectangular" width={100} height={32} />
              </>
            )}
            {!isCategoryLoading &&
              categories?.map((category) => (
                <Chip
                  key={category.id}
                  label={category.name}
                  variant={selectedCategoryId === category.id ? undefined : 'outlined'}
                  className={cn('dark:!text-slate-200', {
                    'dark:!bg-slate-500': selectedCategoryId === category.id,
                  })}
                  onClick={() => handlePickCategory(category.id)}
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
                  <WishItem categories={categories} className="mb-4" key={wish.id} listKey={key} wish={wish} />
                ))
              ) : (
                <div>
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
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DefaultLayout>
  )
}
