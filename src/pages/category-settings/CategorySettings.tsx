import { Alert, Button, Skeleton } from '@mui/material'
import { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { OpenEmoji } from '~/assets'
import { UserHeader } from '~/components/user'
import { useTgBack } from '~/hooks'
import { DefaultLayout } from '~/layouts/default'
import { useAuth } from '~/providers'
import { useUserCategoryQuery } from '~/query'
import { ROUTE } from '~/router'

export const CategorySettings = () => {
  useTgBack({ defaultBackPath: ROUTE.settings })
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: categories, isLoading: isCategoryLoading } = useUserCategoryQuery(user?.id || '', !!user?.id)

  const handleAddCategory = useCallback(() => {
    navigate(ROUTE.categoryNew)
  }, [navigate])

  return (
    <DefaultLayout className="!px-0">
      <UserHeader className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4" editable={false} />
      <div className="px-4">
        <div className="py-4 flex justify-between items-center">
          <h3 className="text-xl bold text-slate-900 dark:text-white mt-2">Настройки списков</h3>
        </div>

        <div className="w-full h-[1px] bg-gray-400" />

        <div className="my-4 gap-4">
          <div className="flex flex-col gap-2">
            <div className="bg-slate-200 dark:bg-slate-600 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm bold text-slate-900 dark:text-white">Настройка категорий</p>

                <Button color="primary" type="button" onClick={handleAddCategory} size="small" variant="text">
                  Добавить
                </Button>
              </div>
              {isCategoryLoading ? (
                <div className="flex flex-col gap-4">
                  <Skeleton className="rounded-lg" variant="rectangular" width={'100%'} height={40} />
                  <Skeleton className="rounded-lg" variant="rectangular" width={'100%'} height={40} />
                  <Skeleton className="rounded-lg" variant="rectangular" width={'100%'} height={40} />
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {categories?.length ? (
                    categories?.map((category) => (
                      <Link
                        to={ROUTE?.category?.replace(':id', category.id)}
                        className="flex p-2 bg-slate-300 dark:bg-slate-800 items-center justify-between rounded-lg"
                        key={category.id}
                      >
                        <div className="flex-1">
                          <p className="text-sm bold text-blue-500 dark:text-blue-200">{category.name}</p>
                          <p className="text-sm bold text-slate-900 dark:text-white">
                            {category?.isPrivate ? '(приватная, по приглашению)' : ''}
                          </p>
                        </div>
                        <OpenEmoji />
                      </Link>
                    ))
                  ) : (
                    <Alert
                      severity="info"
                      className="dark:!bg-slate-300"
                      action={
                        <Button color="primary" type="button" onClick={handleAddCategory} size="small" variant="text">
                          Добавить
                        </Button>
                      }
                    >
                      Вы еще не добавили ни одной категорииц, давайте создадим?
                    </Alert>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}
