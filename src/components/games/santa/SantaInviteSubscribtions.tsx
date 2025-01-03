import { Alert, Button, Skeleton } from '@mui/material'
import { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { GameParticipant, GameResponse } from '~/entities'
import { useAuth, useNotifyContext } from '~/providers'
import { useUserFavoriteSubscribesQuery } from '~/query'
import { useInviteParticipantMutation } from '~/query/game'
import { ROUTE } from '~/router'
import { cn } from '~/utils'

import { SubscribtionsItem } from './SubscribtionsItem'

type Props = {
  participants?: GameParticipant[]
  isLoading?: boolean
  game: GameResponse
  definedParticipantKey?: string
}

export const SantaInviteSubscribtions = (props: Props) => {
  const { user } = useAuth()
  const { setNotify } = useNotifyContext()
  const { participants, isLoading: isLoadingParticipants, game } = props
  const inviteParticipantMutation = useInviteParticipantMutation(game.id, props.definedParticipantKey)

  const { data: subscribes, isLoading: isLoadingSubscribes } = useUserFavoriteSubscribesQuery(
    user?.id || '',
    'subscribes',
    !!user?.id,
  )
  const { data: subscribers, isLoading: isLoadingSubscribers } = useUserFavoriteSubscribesQuery(
    user?.id || '',
    'subscribers',
    !!user?.id,
  )

  const isLoading = isLoadingSubscribes || isLoadingSubscribers || isLoadingParticipants

  const uniqUsers = useMemo(() => {
    const subscribesIds = subscribes?.map((subscribe) => subscribe.favoriteUserId) || []
    const subscribersIds = subscribers?.map((subscriber) => subscriber.userId) || []

    const uniqSets = new Set([...subscribesIds, ...subscribersIds])

    return Array.from(uniqSets).map((id) => {
      const participant = participants?.find((participant) => participant.userId === id)

      return {
        userId: id,
        participant,
      }
    })
  }, [subscribes, subscribers, participants])

  const handleInviteParticipant = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>, userId: string) => {
      e.preventDefault()
      e.stopPropagation()

      try {
        await inviteParticipantMutation.mutateAsync(userId)
        setNotify('Приглашение отправлено', { severity: 'success' })
      } catch (error) {
        console.error(error)
        setNotify('Ошибка при добавлении участника в игру', { severity: 'error' })
      }
    },
    [inviteParticipantMutation, setNotify],
  )

  return (
    <div className="flex flex-col gap-4 mt-4">
      <p className="text-lg font-bold text-slate-900 dark:text-white">Добавить участников в игру из вашего круга</p>
      <p className="text-sm text-slate-900 dark:text-white">
        Пользователь сразу добавиться в участники, приглашение будет отправлено пользователю в личку с ботом желаний.
        Для полноценного участия пользователь должен будет подтвердить приглашение.
      </p>
      <div className="mt-2 gap-4">
        {isLoading ? (
          <>
            <Skeleton className="mb-4 rounded-lg" variant="rectangular" width="100%" height={118} />
            <Skeleton className="mb-4 rounded-lg" variant="rectangular" width="100%" height={118} />
            <Skeleton className="mb-4 rounded-lg" variant="rectangular" width="100%" height={118} />
          </>
        ) : (
          <div className="flex flex-col gap-2">
            {uniqUsers?.length ? (
              uniqUsers?.map((sub) => (
                <Link
                  key={sub.userId}
                  to={
                    sub?.userId === user?.id
                      ? ROUTE.home
                      : ROUTE.userWishList.replace(':id', sub?.userId || sub?.participant?.userId || '')
                  }
                  state={{ prevPage: ROUTE.gameById.replace(':id', game.id) }}
                  className={cn('flex items-center gap-2 hover:opacity-70', {
                    'justify-between': !sub?.participant,
                  })}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <SubscribtionsItem
                      userId={sub.userId}
                      participant={sub.participant}
                      game={game}
                      showMeta={!!sub.participant}
                    />
                  </div>
                  {!sub?.participant && (
                    <Button variant="contained" color="primary" onClick={(e) => handleInviteParticipant(e, sub.userId)}>
                      Пригласить
                    </Button>
                  )}
                </Link>
              ))
            ) : (
              <div>
                <Alert severity="info" className="dark:!bg-slate-300">
                  У вас еще нет ни одного пользователя среди вашего круга подписок и подписчиков
                </Alert>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
