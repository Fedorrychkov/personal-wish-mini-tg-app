import { Avatar } from '@mui/material'
import { useMemo } from 'react'

import { GameParticipant, GameResponse } from '~/entities/games'
import { useUserDataQuery } from '~/query'

type Props = {
  participant: GameParticipant
  showMeta?: boolean
  game?: GameResponse
}

export const GameParticipantItem = ({ participant, showMeta = false, game }: Props) => {
  const { data: user } = useUserDataQuery(participant.userId, participant.userId)

  const name = user?.username || user?.firstName || user?.lastName || user?.id

  const approvedText = useMemo(() => {
    return participant.isGameConfirmed ? 'Участвует' : 'Ожидает подтверждения'
  }, [participant.isGameConfirmed])

  return (
    <>
      <Avatar alt={name} src={user?.avatarUrl || ''} />
      {showMeta && (
        <p className="text-sm text-slate-900 dark:text-white">
          {name} ({game?.userId === participant.userId ? 'Владелец' : 'Участник'}) - {approvedText}
        </p>
      )}
    </>
  )
}
