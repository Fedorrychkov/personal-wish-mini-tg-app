import Button from '@mui/material/Button'
import { initPopup } from '@tma.js/sdk'

import { API_URL } from '~/config'
import { Wish } from '~/entities/wish'
import { useUserWishDeleteMutation } from '~/query/wish/mutations'
import { cn } from '~/utils'

import { ImageLoader } from '../image'

type Props = {
  wish: Wish
  listKey?: string
  className?: string
}

export const WishItem = (props: Props) => {
  const popup = initPopup()
  const { wish, listKey, className } = props || {}

  const imageUrl =
    wish.imageUrl?.includes('/v1/file') && !wish.imageUrl?.includes('http')
      ? `${API_URL}${wish.imageUrl}`
      : wish.imageUrl

  const deleteMutation = useUserWishDeleteMutation(wish.id, listKey)

  const isLoading = deleteMutation?.isLoading

  const handleDeleteWish = async () => {
    deleteMutation.mutateAsync()
  }

  const handleDeletePopup = () => {
    popup
      .open({
        title: 'Вы уверены, что хотите удалить желание?',
        message:
          'Удаление желания приведет к потере данных о нем, ваши друзья больше не смогу увидеть это желание в вашем списке',
        buttons: [
          { id: 'ok', type: 'default', text: 'Удалить' },
          { id: 'cancel', type: 'destructive', text: 'Назад' },
        ],
      })
      .then((buttonId) => {
        if (!buttonId || buttonId === 'cancel') {
          return
        }

        handleDeleteWish()
      })
  }

  return (
    <div className={cn('bg-slate-200 dark:bg-slate-600 p-2 rounded-lg', className)}>
      <div className="flex gap-4 items-center justify-start" key={wish.id}>
        <ImageLoader
          defaultPlaceholder={null}
          src={imageUrl || ''}
          className="min-w-[64px] w-[64px] h-[64px] object-cover rounded-lg"
          alt={`Wish Img ${wish.name}`}
        />
        <div className="overflow-hidden w-full">
          <p className={cn('text-lg text-slate-900 dark:text-white truncate')}>{wish.name}</p>
          <p className={cn('mt-1 text-xs text-slate-900 dark:text-white truncate-2-line')}>{wish.description}</p>
        </div>
      </div>
      <div className="gap-4 mt-2 flex justify-between">
        <Button color="primary" size="small" variant="text" disabled>
          Забронировать
        </Button>
        <Button color="primary" size="small" variant="text" disabled>
          Редактировать
        </Button>
        <Button color="error" size="small" variant="text" onClick={handleDeletePopup} disabled={isLoading}>
          Удалить
        </Button>
      </div>
    </div>
  )
}
