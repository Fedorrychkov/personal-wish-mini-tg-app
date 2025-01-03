import { Alert, AvatarGroup, Chip } from '@mui/material'
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { ShareEmoji } from '~/assets'
import { GameResponse, GameStatus, gameStatusColors, gameStatusNames } from '~/entities/games'
import { useAuth } from '~/providers'
import { useParticipantsQuery } from '~/query/game'
import { ROUTE } from '~/router'
import { shareTgLink } from '~/utils'

import { GameParticipantItem } from './GameParticipant'

type Props = {
  game: GameResponse
}

export const SantaCard = ({ game }: Props) => {
  const { data: participants } = useParticipantsQuery(game.id)
  const { user } = useAuth()
  const navigate = useNavigate()

  const isOwner = useMemo(() => {
    return game.userId === user?.id
  }, [game.userId, user?.id])

  const handleShare = useCallback(() => {
    shareTgLink(`santa_${game.id}`, false)
  }, [game.id])

  const handleOpen = useCallback(() => {
    navigate(ROUTE.gameById.replace(':id', game.id))
  }, [game.id, navigate])

  const approvedParticipants = useMemo(() => {
    return participants?.filter((participant) => participant.isGameConfirmed)
  }, [participants])

  return (
    <div
      className="flex flex-col gap-2 bg-gray-200 dark:bg-slate-400 rounded-2xl p-2 cursor-pointer hover:opacity-[0.8]"
      onClick={handleOpen}
    >
      <div className="flex justify-between items-start">
        <p className="text-lg bold text-slate-900 dark:text-white truncate py-2">{game.name}</p>

        {game.status && [GameStatus.CREATED].includes(game.status) && (
          <div className="flex flex-col gap-2 items-start justify-start">
            <button
              type="button"
              className="flex items-center justify-center gap-2 border-none bg-slate-200 dark:bg-slate-300 rounded-lg hover:opacity-[0.8] text-sm text-slate-900 dark:text-white py-2 px-4"
              title="Поделиться"
              onClick={handleShare}
            >
              <span className="text-sm">Пригласить</span>
              <ShareEmoji className="text-lg" />
            </button>
          </div>
        )}

        {game.status && ![GameStatus.CREATED].includes(game.status) && (
          <div className="flex flex-col gap-2 items-start justify-start">
            <Chip label={gameStatusNames(game.status)} color={gameStatusColors(game.status)} />
          </div>
        )}
      </div>
      <div className="flex gap-2 justify-between">
        <div className="flex flex-col gap-2 items-start justify-start">
          {approvedParticipants?.length ? (
            <>
              <p className="text-sm text-slate-900 dark:text-white">Участники:</p>
              <AvatarGroup max={6} total={approvedParticipants?.length}>
                {approvedParticipants?.map((participant) => (
                  <GameParticipantItem key={participant.id} participant={participant} />
                ))}
              </AvatarGroup>
            </>
          ) : null}
        </div>
      </div>

      {approvedParticipants &&
      approvedParticipants?.length < 2 &&
      isOwner &&
      game.status &&
      [GameStatus.CREATED].includes(game.status) ? (
        <Alert severity="warning">Для проведения игры требуется минимум 2 подтвержденных участника.</Alert>
      ) : null}
    </div>
  )
}
