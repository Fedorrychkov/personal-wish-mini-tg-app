import { Alert, Button } from '@mui/material'
import { AxiosError } from 'axios'
import { useCallback, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { ShareEmoji } from '~/assets'
import { TextFieldContainer } from '~/components/fields'
import { Spinner } from '~/components/loaders'
import { User } from '~/entities'
import { ERRORS, getErrorMessageByCode } from '~/errors'
import { useRegister } from '~/hooks'
import { useAuth, useNotifyContext } from '~/providers'
import { useGetUserFromStorageDataById, useSearchUserMutation } from '~/query'
import { cn, shareTgLink } from '~/utils'

type Form = {
  username: string
}

type Props = {
  knowedUserIds?: string[]
  className?: string
  onSearched?: (value?: User) => void
}

export const SearchUser = (props?: Props) => {
  const { user } = useAuth()
  const { setNotify } = useNotifyContext()

  const [isNotfounNotification, setNotfoundNotification] = useState(false)

  const { knowedUserIds, className, onSearched } = props || {}
  const { handleGetUserData } = useGetUserFromStorageDataById()

  const searchMutation = useSearchUserMutation()

  const knowedUserList = useMemo(() => {
    const mappedList = knowedUserIds?.map((userId) => handleGetUserData(userId))
    const filteredList = mappedList ? mappedList?.filter(Boolean) : []

    return [...(user ? [user] : []), ...filteredList]
  }, [user, knowedUserIds, handleGetUserData])

  const form = useForm<Form>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      username: '',
    },
  })

  const { handleSubmit, formState, register, reset } = form
  const { errors } = formState

  const onSubmit = useCallback(
    async (payload: Form) => {
      setNotfoundNotification(false)

      try {
        const result = await searchMutation.mutateAsync(payload.username?.replace?.('@', ''))

        onSearched?.(result)
        reset()
      } catch (error) {
        onSearched?.(undefined)

        if (error instanceof AxiosError) {
          setNotify(getErrorMessageByCode(error?.response?.data?.code), { severity: 'error' })

          if (error?.response?.data?.code === ERRORS.user.ERROR_CODES.USER_NOT_FOUND) {
            setNotfoundNotification(true)
          }
        }
      }
    },
    [setNotify, onSearched, searchMutation, reset],
  )

  const usernameField = useRegister({
    ...register('username', {
      required: {
        value: true,
        message: 'Никнейм обязателен для поиска',
      },
      maxLength: {
        value: 200,
        message: 'Максимум 200 символов',
      },
      validate: {
        username: (value: string) => {
          const lowerCasedValue = value?.toLowerCase?.() || ''
          const found = knowedUserList?.find((user) => user?.username?.toLowerCase?.() === lowerCasedValue)

          const ownerText =
            found?.username?.toLowerCase?.() === user?.username?.toLowerCase?.()
              ? 'Никнейм не должен совпадать с вашим'
              : ''
          const otherUsersText = found ? 'Пользователь с таким ником уже доступен для выбора' : ''

          const isEmpty = !ownerText && !otherUsersText

          return isEmpty ? true : ownerText || otherUsersText
        },
      },
    }),
    errors,
    withRef: false,
  })

  const isLoading = searchMutation.isLoading

  const handleShare = useCallback(() => {
    const payload = JSON.stringify({ id: user?.id })

    shareTgLink(payload)
  }, [user])

  return (
    <div className={cn('w-full', className)}>
      <FormProvider {...form}>
        <form className="flex items-center gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex-1">
            <TextFieldContainer
              {...usernameField}
              className="w-full mt-4"
              preventDisabled={isLoading}
              placeholder="Никнейм пользователя (без @)"
              label="Никнейм пользователя (без @)"
              endAdornment={
                <Button color="primary" size="small" type="submit" variant="text" disabled={isLoading}>
                  {isLoading ? <Spinner className="!w-[24px] !h-[24px]" /> : 'Найти'}
                </Button>
              }
              required
            />
          </div>
        </form>
      </FormProvider>

      {isNotfounNotification && (
        <div className="my-2">
          <Alert
            severity="warning"
            className="dark:!bg-slate-300"
            action={
              <button
                type="button"
                className="border-none bg-slate-200 dark:bg-slate-300 rounded-[50%] w-[40px] h-[40px] hover:opacity-[0.8]"
                title="Поделиться"
                onClick={handleShare}
              >
                <ShareEmoji className="text-lg" />
              </button>
            }
          >
            Поделиться вашим вишлистом, для приглашения в список желания
          </Alert>
        </div>
      )}
    </div>
  )
}
