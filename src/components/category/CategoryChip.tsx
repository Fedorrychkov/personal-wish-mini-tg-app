import { Chip } from '@mui/material'
import { MouseEvent, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { SettingsEmoji, ShareEmoji } from '~/assets'
import { Category } from '~/entities'
import { useAuth } from '~/providers'
import { ROUTE } from '~/router'
import { cn, shareTgLink } from '~/utils'

type Props = {
  category: Category
  onClick: (id: string) => void
  selected?: boolean
}

export const CategoryChip = (props: Props) => {
  const { category, selected, onClick } = props
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()

      onClick(category.id)
    },
    [category, onClick],
  )

  const handleShare = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      const payload = JSON.stringify({ cId: category.id })

      shareTgLink(payload)
    },
    [category?.id],
  )

  const handleOpenCategorySetting = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      navigate(ROUTE.category?.replace(':id', category.id), { state: { prevPage: ROUTE.home }, replace: true })
    },
    [navigate, category?.id],
  )

  return (
    <Chip
      label={
        <div
          className={cn('flex gap-3 items-center', {
            '!text-orange-400	dark:!text-orange-400': category?.isPrivate,
          })}
        >
          {category.name}
          <div className="gap-2 flex">
            {user?.id === category?.userId && (
              <button
                type="button"
                className="border-none bg-slate-200 dark:bg-slate-300 rounded-[50%] w-[24px] h-[24px] hover:opacity-[0.8]"
                title="Настройки"
                onClick={handleOpenCategorySetting}
              >
                <SettingsEmoji />
              </button>
            )}
            <button
              type="button"
              className="border-none bg-slate-200 dark:bg-slate-300 rounded-[50%] w-[24px] h-[24px] hover:opacity-[0.8]"
              title="Поделиться"
              onClick={handleShare}
            >
              <ShareEmoji />
            </button>
          </div>
        </div>
      }
      variant={selected ? 'outlined' : undefined}
      className={cn(
        'dark:!text-slate-200 !bg-slate-200/[.5] dark:!bg-slate-900/[.5] hover:!bg-slate-200 dark:hover:!bg-slate-900',
        {
          'dark:!bg-slate-800 !bg-slate-200': selected,
        },
      )}
      onClick={handleClick}
    />
  )
}
