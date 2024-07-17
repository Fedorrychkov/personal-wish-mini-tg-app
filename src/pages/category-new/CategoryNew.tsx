import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { CategoryForm } from '~/components/category'
import { UserHeader } from '~/components/user'
import { useTgBack } from '~/hooks'
import { DefaultLayout } from '~/layouts/default'
import { ROUTE } from '~/router'

export const CategoryNew = () => {
  const location = useLocation()

  useTgBack({ defaultBackPath: location?.state?.prevPage ?? ROUTE.categorySettings })

  const navigate = useNavigate()

  const handleBackToSettings = useCallback(() => {
    navigate(ROUTE.categorySettings)
  }, [navigate])

  return (
    <DefaultLayout className="!px-0">
      <UserHeader className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4" editable={false} />
      <div className="px-4">
        <div className="py-4 flex justify-between items-center">
          <h3 className="text-xl bold text-slate-900 dark:text-white mt-2">Создание категории (списка)</h3>
        </div>

        <div className="w-full h-[1px] bg-gray-400" />

        <div className="bg-slate-200 dark:bg-slate-600 p-4 rounded-lg my-4">
          <CategoryForm onCancel={handleBackToSettings} />
        </div>
      </div>
    </DefaultLayout>
  )
}
