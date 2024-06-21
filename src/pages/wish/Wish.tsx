import { Button } from '@mui/material'
import { initBackButton } from '@tma.js/sdk'
import { useNavigate, useParams } from 'react-router-dom'

import { ImageLoader } from '~/components/image'
import { useWishDelete } from '~/components/wish'
import { DefaultLayout } from '~/layouts/default'
import { useAuth } from '~/providers/auth'
import { useUserWishItemQuery } from '~/query'
import { ROUTE } from '~/router'

export const Wish = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [backButton] = initBackButton()
  const { user } = useAuth()
  const { data: wish, isLoading, isFetched } = useUserWishItemQuery(id || '', `${user?.id}`)

  backButton.show()

  backButton.on('click', () => {
    navigate(ROUTE.home, { replace: true })
  })

  const { handleDeletePopup, isLoading: isDeletionLoading } = useWishDelete(wish, '', () => {
    navigate(ROUTE.home, { replace: true })
  })

  return (
    <DefaultLayout className="!px-0">
      <ImageLoader
        defaultPlaceholder={
          <div className="bg-gray-200 dark:bg-slate-400 w-full w-full h-[200px] flex items-center justify-center">
            <p>Изображение не установлено</p>
          </div>
        }
        src={wish?.imageUrl || ''}
        isLoading={!wish || isLoading || !isFetched}
        className="bg-gray-200 dark:bg-slate-400 object-contain w-full w-full h-[200px]"
        alt={`Wish Image of ${wish?.name || 'Без названия'}`}
      />
      <div className="px-4">
        <div className="py-4">
          <h3 className="text-xl bold text-slate-900 dark:text-white mt-2">{wish?.name || 'Без названия'}</h3>
        </div>
        <div className="w-full h-[1px] bg-gray-400" />

        <div className="mt-2 gap-4">
          <p className="text-sm bold text-slate-900 dark:text-white mt-2">{wish?.description || 'Без Описания'}</p>
        </div>

        <div className="w-full h-[1px] bg-gray-400 my-2" />
        <div className="gap-4 mt-2 flex justify-between">
          <Button
            color="error"
            size="small"
            type="button"
            variant="text"
            onClick={handleDeletePopup}
            disabled={isLoading || isDeletionLoading}
          >
            Удалить
          </Button>
        </div>
      </div>
    </DefaultLayout>
  )
}
