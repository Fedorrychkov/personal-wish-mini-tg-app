import Button from '@mui/material/Button'
import { initHapticFeedback } from '@tma.js/sdk'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { API_URL } from '~/config'
import { Category } from '~/entities'
import { Wish } from '~/entities/wish'
import { useAuth } from '~/providers'
import { ROUTE } from '~/router'
import { cn } from '~/utils'

import { ImageLoader } from '../image'
import { Avatar } from '../placeholder'
import { getBookButtonState } from './helpers'
import { useWishDelete } from './hooks'
import { useWishBook } from './hooks/useWishBook'

type Props = {
  wish: Wish
  listKey?: string
  className?: string
  categories?: Category[]
  onFilterByCategoryId?: () => void
}

export const WishItem = (props: Props) => {
  const navigate = useNavigate()
  const { wish, listKey, className, categories, onFilterByCategoryId } = props || {}
  const { user } = useAuth()
  const haptic = initHapticFeedback()

  const isOwner = wish?.userId == user?.id

  const imageUrl =
    wish.imageUrl?.includes('/v1/file') && !wish.imageUrl?.includes('http')
      ? `${API_URL}${wish.imageUrl}`
      : wish.imageUrl

  const { handleDeletePopup, isLoading: isDeletionLoading } = useWishDelete(wish, listKey || '')
  const { handleBookPopup, isLoading: isBookingLoading } = useWishBook(wish, listKey || '')

  const handleWishOpen = (e: any) => {
    e?.stopPropagation?.()
    e?.preventDefault?.()

    haptic.impactOccurred('medium')

    navigate(ROUTE.wish.replace(':id', wish.id))
  }

  const category = useMemo(() => categories?.find((category) => category?.id === wish?.categoryId), [wish, categories])

  const { disabled: bookBtnDisabled, text: bookBtnText } = getBookButtonState(wish, user)

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
          <div className="flex justify-between">
            <Link
              to={ROUTE.wish?.replace(':id', wish?.id)}
              className={cn('text-lg text-slate-900 dark:text-white truncate')}
            >
              {wish.name || 'Название не установлено'}
            </Link>
            {category && (
              <button
                type="button"
                onClick={onFilterByCategoryId}
                className="text-xs bold p-2 bg-slate-100 dark:bg-slate-400 text-slate-700 dark:text-slate-100 rounded-md truncate hover:opacity-[0.8]"
              >
                {category.name}
              </button>
            )}
          </div>
          <p className={cn('mt-1 text-xs text-slate-900 dark:text-white truncate-2-line')}>
            {wish.description || 'Описание не установлено'}
          </p>
        </div>
      </div>
      <div className="gap-4 mt-2 flex justify-between">
        <Button
          color="primary"
          type="button"
          size="small"
          variant="text"
          onClick={handleBookPopup}
          disabled={bookBtnDisabled || isBookingLoading}
        >
          {bookBtnText}
        </Button>
        <Button color="primary" type="button" onClick={handleWishOpen} size="small" variant="text">
          {isOwner ? 'Редактировать' : 'Посмотреть'}
        </Button>
        {isOwner && (
          <Button
            color="error"
            size="small"
            type="button"
            variant="text"
            onClick={handleDeletePopup}
            disabled={isDeletionLoading}
          >
            Удалить
          </Button>
        )}
      </div>
    </div>
  )
}
