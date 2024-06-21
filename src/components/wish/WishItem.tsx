import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'

import { API_URL } from '~/config'
import { Wish } from '~/entities/wish'
import { ROUTE } from '~/router'
import { cn } from '~/utils'

import { ImageLoader } from '../image'
import { Avatar } from '../placeholder'
import { useWishDelete } from './hooks'

type Props = {
  wish: Wish
  listKey?: string
  className?: string
}

export const WishItem = (props: Props) => {
  const navigate = useNavigate()
  const { wish, listKey, className } = props || {}

  const imageUrl =
    wish.imageUrl?.includes('/v1/file') && !wish.imageUrl?.includes('http')
      ? `${API_URL}${wish.imageUrl}`
      : wish.imageUrl

  const { handleDeletePopup, isLoading } = useWishDelete(wish, listKey || '')

  const handleWishOpen = (e: any) => {
    e?.stopPropagation?.()
    e?.preventDefault?.()

    navigate(ROUTE.wish.replace(':id', wish.id))
  }

  return (
    <div className={cn('bg-slate-200 dark:bg-slate-600 p-2 rounded-lg', className)}>
      <div className="flex gap-4 items-center justify-start" key={wish.id}>
        <ImageLoader
          onClick={handleWishOpen}
          defaultPlaceholder={<Avatar text={'Пусто'} className="min-w-[64px] w-[64px] h-[64px] rounded-lg" />}
          src={imageUrl || ''}
          className="min-w-[64px] w-[64px] h-[64px] object-cover rounded-lg"
          alt={`Wish Img ${wish.name || 'Название не установлено'}`}
        />
        <div className="overflow-hidden w-full">
          <p className={cn('text-lg text-slate-900 dark:text-white truncate')}>
            {wish.name || 'Название не установлено'}
          </p>
          <p className={cn('mt-1 text-xs text-slate-900 dark:text-white truncate-2-line')}>
            {wish.description || 'Описание не установлено'}
          </p>
        </div>
      </div>
      <div className="gap-4 mt-2 flex justify-between">
        <Button color="primary" type="button" size="small" variant="text" disabled>
          Забронировать
        </Button>
        <Button color="primary" type="button" onClick={handleWishOpen} size="small" variant="text">
          Редактировать
        </Button>
        <Button
          color="error"
          size="small"
          type="button"
          variant="text"
          onClick={handleDeletePopup}
          disabled={isLoading}
        >
          Удалить
        </Button>
      </div>
    </div>
  )
}
