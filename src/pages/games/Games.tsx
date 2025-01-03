import { useEffect } from 'react'

import { GameList } from '~/components/games'
import { UserHeader } from '~/components/user'
import { useTgBack } from '~/hooks'
import { DefaultLayout } from '~/layouts/default'
import { useAuth, useCustomization } from '~/providers'
import { ROUTE } from '~/router'

export const Games = () => {
  useTgBack({ defaultBackPath: ROUTE.home })

  const { user } = useAuth()

  const { updateUserCustomizationId } = useCustomization()

  useEffect(() => {
    updateUserCustomizationId(user?.id)
  }, [user?.id, updateUserCustomizationId])

  return (
    <DefaultLayout className="!px-0">
      <UserHeader className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4" editable={false} />
      <div className="px-4">
        <div className="py-4 flex justify-between items-center">
          <h3 className="text-xl bold text-slate-900 dark:text-white">Игры</h3>
        </div>

        <div className="w-full h-[1px] bg-gray-400" />
        <GameList className="mt-4" />
      </div>
    </DefaultLayout>
  )
}
