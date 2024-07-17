import { Alert, Button } from '@mui/material'
import { useCallback } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { CategoryForm, CategoryFormSkeleton } from '~/components/category'
import { UserHeader } from '~/components/user'
import { useTgBack } from '~/hooks'
import { DefaultLayout } from '~/layouts/default'
import { useAuth } from '~/providers'
import { useCategoryQuery } from '~/query'
import { ROUTE } from '~/router'

export const Category = () => {
  const location = useLocation()

  useTgBack({ defaultBackPath: location?.state?.prevPage ?? ROUTE.categorySettings })

  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: category, isLoading: isCategoryLoading, key: definedCategoryKey } = useCategoryQuery(id || '', !!id)

  const handleBackToSettings = useCallback(() => {
    navigate(ROUTE.categorySettings)
  }, [navigate])

  if (category && category?.userId !== user?.id) {
    return (
      <DefaultLayout className="!px-0">
        <UserHeader className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4" editable={false} />

        <Alert
          severity="info"
          className="dark:!bg-slate-300 mt-4"
          action={
            <Button color="primary" type="button" onClick={handleBackToSettings} size="small" variant="text">
              К настройке списков
            </Button>
          }
        >
          Категория не пренадлежит вам, вернитесь в свой список категорий для продолжения
        </Alert>
      </DefaultLayout>
    )
  }

  if (!category && !isCategoryLoading) {
    return (
      <DefaultLayout className="!px-0">
        <UserHeader className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4" editable={false} />

        <Alert
          severity="info"
          className="dark:!bg-slate-300 mt-4"
          action={
            <Button color="primary" type="button" onClick={handleBackToSettings} size="small" variant="text">
              К настройке списков
            </Button>
          }
        >
          Не удалось получить категорию, вернитесь к списку категорий для продолжения
        </Alert>
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout className="!px-0">
      <UserHeader className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4" editable={false} />
      <div className="px-4">
        <div className="py-4 flex justify-between items-center">
          <h3 className="text-xl bold text-slate-900 dark:text-white mt-2">Настройка категории (списка)</h3>
        </div>

        <div className="w-full h-[1px] bg-gray-400" />

        <div className="bg-slate-200 dark:bg-slate-600 p-4 rounded-lg my-4">
          {isCategoryLoading && !category ? (
            <CategoryFormSkeleton />
          ) : (
            <CategoryForm definedKey={definedCategoryKey} category={category} onCancel={handleBackToSettings} />
          )}
        </div>
      </div>
    </DefaultLayout>
  )
}
