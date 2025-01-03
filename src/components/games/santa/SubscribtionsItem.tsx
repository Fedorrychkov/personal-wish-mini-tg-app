import { Avatar } from '@mui/material'
import { useMemo } from 'react'

import { GameParticipant, GameResponse } from '~/entities/games'
import { useUserDataQuery } from '~/query'
import { cn } from '~/utils'

type Props = {
  userId: string
  participant?: GameParticipant
  showMeta?: boolean
  game?: GameResponse
  className?: string
}

export const SubscribtionsItem = ({ userId, showMeta = false, game, participant, className }: Props) => {
  const { data: user } = useUserDataQuery(userId, userId, !!userId)

  const name = user?.username || user?.firstName || user?.lastName || user?.id

  const approvedText = useMemo(() => {
    if (!participant) return ''

    return participant.isGameConfirmed ? 'Участвует' : 'Ожидает подтверждения'
  }, [participant])

  return (
    <>
      <Avatar alt={name} src={user?.avatarUrl || ''} />
      {showMeta ? (
        <p className={cn('text-sm text-slate-900 dark:text-white', className)}>
          {name} ({participant ? (game?.userId === participant.userId ? 'Владелец' : 'Участник') : ''}){' '}
          {approvedText ? `- ${approvedText}` : ''}
        </p>
      ) : (
        <p className={cn('text-sm text-slate-900 dark:text-white', className)}>{name}</p>
      )}
    </>
  )
}
