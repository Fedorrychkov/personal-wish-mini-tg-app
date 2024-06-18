import { initBackButton } from '@tma.js/sdk'

import { UserHeader } from '~/components/user'
import { WishItem } from '~/components/wish'
import { DefaultLayout } from '~/layouts/default'
import { useAuth } from '~/providers/auth'
import { useUserWishQuery } from '~/query'

export const Home = () => {
  const [backButton] = initBackButton()
  const { user } = useAuth()
  const { data, key } = useUserWishQuery(`${user?.id}`)

  backButton.hide()

  return (
    <DefaultLayout className="!px-0">
      <UserHeader className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4" />
      <div className="px-4">
        <div className="py-4">
          <h3 className="text-xl bold text-slate-900 dark:text-white mt-2">Желания</h3>
        </div>
        <div className="w-full h-[1px] bg-gray-400" />

        <div className="mt-2 gap-4">
          {data?.map((wish) => <WishItem className="mb-4" key={wish.id} listKey={key} wish={wish} />)}
        </div>
      </div>
    </DefaultLayout>
  )
}
