import { Chip } from '@mui/material'
import { MouseEvent, useCallback } from 'react'

import { ShareEmoji } from '~/assets'
import { Category } from '~/entities'
import { cn, shareTgLink } from '~/utils'

type Props = {
  category: Category
  onClick: (id: string) => void
  selected?: boolean
}

export const CategoryChip = (props: Props) => {
  const { category, selected, onClick } = props

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

  return (
    <Chip
      label={
        <div className="flex gap-2 items-center">
          {category.name}

          <button
            type="button"
            className="border-none bg-slate-200 dark:bg-slate-300 rounded-[50%] w-[24px] h-[24px] hover:opacity-[0.8]"
            title="Поделиться"
            onClick={handleShare}
          >
            <ShareEmoji />
          </button>
        </div>
      }
      variant={selected ? undefined : 'outlined'}
      className={cn('dark:!text-slate-200', {
        'dark:!bg-slate-500': selected,
      })}
      onClick={handleClick}
    />
  )
}
