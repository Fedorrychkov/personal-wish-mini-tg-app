import { Alert, Box, Button, Chip, Tab, Tabs } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { ShareEmoji } from '~/assets'
import { GameResponse, GameStatus, gameStatusColors, gameStatusNames } from '~/entities/games'
import { useAuth, useNotifyContext } from '~/providers'
import { useAcceptParticipantInvitationMutation, useMyParticipantQuery, useParticipantsQuery } from '~/query/game'
import { ROUTE } from '~/router'
import { shareTgLink } from '~/utils'

import { GameParticipantItem } from './GameParticipant'
import { useCancelByPopup } from './hooks/useCancelByPopup'
import { useFinishByPopup } from './hooks/useFinishByPopup'
import { useRunByPopup } from './hooks/useRunByPopup'
import { SantaInviteSubscribtions } from './SantaInviteSubscribtions'
import { SubscribtionsItem } from './SubscribtionsItem'

type SantaGameProps = {
  game: GameResponse
}

export const SantaGameView = ({ game }: SantaGameProps) => {
  const { setNotify } = useNotifyContext()

  const {
    data: participants,
    isLoading: isLoadingParticipants,
    key: participantsKey,
  } = useParticipantsQuery(game.id, !!game.id)
  const acceptInvitationMutation = useAcceptParticipantInvitationMutation(game.id, participantsKey)
  const { user } = useAuth()

  const { data: myParticipant } = useMyParticipantQuery(
    game.id,
    !!game.id && !!game.status && ![GameStatus.CREATED, GameStatus.CANCELLED].includes(game.status),
  )

  const [value, setValue] = useState<string>('0')

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const { handleCancelPopup } = useCancelByPopup(game.id, `game-${game.id}`)
  const { handleRunPopup } = useRunByPopup(game.id, `game-${game.id}`)
  const { handleFinishPopup } = useFinishByPopup(game.id, `game-${game.id}`)

  const isOwner = useMemo(() => {
    return game.userId === user?.id
  }, [game.userId, user?.id])

  const handleShare = useCallback(() => {
    shareTgLink(`santa_${game.id}`, false)
  }, [game.id])

  const isNotStarted = useMemo(() => {
    return game.status && [GameStatus.CREATED].includes(game.status)
  }, [game.status])

  const approvedParticipants = useMemo(() => {
    return participants?.filter((participant) => participant.isGameConfirmed)
  }, [participants])

  const isNotEnoughParticipants = useMemo(() => {
    return approvedParticipants && approvedParticipants?.length < 2
  }, [approvedParticipants])

  const waitingMeAsParticipant = useMemo(() => {
    return participants?.find((participant) => participant.userId === user?.id && !participant.isGameConfirmed)
  }, [participants, user?.id])

  const isWaitingMeAsParticipant = !!waitingMeAsParticipant

  const handleAcceptInvite = useCallback(async () => {
    try {
      await acceptInvitationMutation.mutateAsync()
      setNotify('Приглашение принято', { severity: 'success' })
    } catch (error) {
      console.error(error)
      setNotify('Не удалось принять приглашение', { severity: 'error' })
    }
  }, [acceptInvitationMutation, setNotify])

  return (
    <div className="flex flex-col gap-2 py-4 px-4">
      <h3 className="text-xl bold text-slate-900 dark:text-white">Игра: {game?.name}</h3>
      <Chip label={gameStatusNames(game.status)} color={gameStatusColors(game.status)} />
      {myParticipant && myParticipant.recipientUserId && (
        <Alert severity="success">
          <div className="flex flex-col gap-4 items-start justify-start">
            <p className="text-sm text-slate-900 flex">Вы стали тайным сантой для:</p>
            <div className="flex items-center gap-2">
              <SubscribtionsItem
                userId={myParticipant.recipientUserId}
                participant={myParticipant}
                showMeta
                game={game}
                className="!text-slate-900"
              />
            </div>
            <p className="text-sm text-slate-900 flex">
              Обязательно выберите желание для своего подопечного перейдя в его список желаний
            </p>
            <Link
              to={ROUTE.userWishList.replace(':id', myParticipant.recipientUserId)}
              state={{ prevPage: ROUTE.gameById.replace(':id', game.id) }}
              className="flex items-center gap-2 hover:opacity-70 bg-blue-500 text-white rounded-lg py-2 px-4"
            >
              Выбрать желание
            </Link>
          </div>
        </Alert>
      )}
      {isWaitingMeAsParticipant && isNotStarted && (
        <Alert severity="warning">
          <span className="text-sm text-slate-900 block mb-4">
            Вас пригласили в игру, нажмите на кнопку "Принять участие", чтобы принять приглашение
          </span>
          <Button variant="contained" color="success" onClick={handleAcceptInvite}>
            Принять участие
          </Button>
        </Alert>
      )}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="Santa game tabs" variant="scrollable">
          <Tab label="Основная информация" value="0" className="w-[50%]" />
          <Tab label="Пригласить из подписок" value="1" className="w-[50%]" disabled={!isNotStarted} />
        </Tabs>
      </Box>
      <div className="flex flex-col gap-4 mt-4">
        <div role="tabpanel" hidden={value !== '0'} id="simple-tabpanel-0" aria-labelledby="simple-tab-0">
          {value === '0' && (
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-slate-900 dark:text-white">Участники:</p>
                {participants?.map((participant) => (
                  <Link
                    key={participant.id}
                    to={
                      participant.userId === user?.id
                        ? ROUTE.home
                        : ROUTE.userWishList.replace(':id', participant.userId)
                    }
                    state={{ prevPage: ROUTE.gameById.replace(':id', game.id) }}
                    className="flex items-center gap-2 hover:opacity-70"
                  >
                    <GameParticipantItem participant={participant} showMeta game={game} />
                  </Link>
                ))}
              </div>

              {isNotStarted && (
                <div className="flex flex-col gap-2 items-start justify-start">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 border-none bg-slate-200 dark:bg-slate-300 rounded-lg hover:opacity-[0.8] text-sm text-slate-900 dark:text-white py-2 px-4"
                    title="Поделиться"
                    onClick={handleShare}
                  >
                    <span className="text-sm">Отправить ссылку - приглашение на игру</span>
                    <ShareEmoji className="text-lg" />
                  </button>
                </div>
              )}

              {isNotEnoughParticipants && isNotStarted ? (
                <Alert severity="warning">Для проведения игры требуется минимум 2 участника.</Alert>
              ) : null}

              {isNotStarted && isOwner && (
                <div className="flex gap-2 items-start justify-between">
                  <Button
                    type="button"
                    variant="text"
                    color="error"
                    className="text-sm text-slate-900 dark:text-white"
                    onClick={handleCancelPopup}
                  >
                    Отменить игру
                  </Button>
                  {!isNotEnoughParticipants && (
                    <Button
                      type="button"
                      variant="contained"
                      color="success"
                      onClick={handleRunPopup}
                      className="text-sm text-slate-900 dark:text-white"
                    >
                      Разыграть
                    </Button>
                  )}
                </div>
              )}
              {game.status && [GameStatus.ACTIVE].includes(game.status) && isOwner && (
                <div className="flex flex-col gap-2 items-start justify-start">
                  <Button
                    type="button"
                    variant="contained"
                    color="success"
                    className="w-full"
                    onClick={handleFinishPopup}
                  >
                    Завершить
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        <div role="tabpanel" hidden={value !== '1'} id="simple-tabpanel-1" aria-labelledby="simple-tab-1">
          {value === '1' && (
            <SantaInviteSubscribtions
              game={game}
              participants={participants}
              isLoading={isLoadingParticipants}
              definedParticipantKey={participantsKey}
            />
          )}
        </div>
        <div className="h-[64px]" />
      </div>
    </div>
  )
}
