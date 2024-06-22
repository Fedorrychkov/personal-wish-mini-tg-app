import { Alert, Button } from '@mui/material'
import { useCallback } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Wish, WishDto } from '~/entities/wish'
import { useRegister } from '~/hooks'
import { useAuth } from '~/providers/auth'
import { useUserDataQuery } from '~/query'
import { URL_REGEXP } from '~/utils'

import { TextFieldContainer } from '../fields'
import { useWishUpdate } from './hooks'

type Props = {
  wish?: Wish
  definedKey?: string
  onCancel?: () => void
}

export const WishForm = ({ wish, definedKey, onCancel }: Props) => {
  const { user } = useAuth()
  const isOwner = user?.id === wish?.userId
  const { data: wishUserOwner } = useUserDataQuery(wish?.userId || '', wish?.userId, !isOwner)

  const form = useForm<WishDto>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: wish?.name || '',
      description: wish?.description || '',
      link: wish?.link || '',
      imageUrl: wish?.imageUrl || '',
    },
  })

  const { handleSubmit, register, formState } = form
  const { errors } = formState

  const { handleUpdatePopup, isLoading } = useWishUpdate(wish, definedKey, () => {
    onCancel?.()
  })

  const onSubmit = useCallback(
    async (payload: WishDto) => {
      handleUpdatePopup(payload)
    },
    [handleUpdatePopup],
  )

  const nameField = useRegister({
    ...register('name', {
      required: {
        value: true,
        message: 'Название желания обязательно',
      },
      maxLength: 160,
    }),
    errors,
    withRef: false,
  })

  const descriptionField = useRegister({
    ...register('description', {
      maxLength: 600,
    }),
    errors,
    withRef: false,
  })

  const linkField = useRegister({
    ...register('link', {
      required: {
        value: true,
        message: 'Ссылка на желание обязательно',
      },
      pattern: {
        value: URL_REGEXP,
        message: 'Неправильный url, пример: https://domain.com',
      },
    }),
    errors,
    withRef: false,
  })

  return (
    <FormProvider {...form}>
      <form className="p-4 pt-0" onSubmit={handleSubmit(onSubmit)}>
        <div className="py-4">
          <div className="gap-4 mt-1 flex items-baseline">
            <div className="text-sm bold text-slate-700 dark:text-slate-400">
              {isOwner ? 'Мое желание' : `Желание пользователя @${wishUserOwner?.username}`}
            </div>
            {wish?.isBooked ? (
              <div className="text-xs p-1 bg-gray-200 text-slate-700 dark:text-slate-400">
                {wish?.bookedUserId === user?.id ? 'забронировано вами' : 'забронировано'}
              </div>
            ) : null}
          </div>
        </div>
        <div className="gap-4 flex flex-col">
          <div>
            <TextFieldContainer
              {...nameField}
              className="w-full mt-4"
              preventDisabled={isLoading}
              placeholder="Название желания"
              label="Название желания"
              required
            />
          </div>
          <div>
            <TextFieldContainer
              {...linkField}
              className="w-full mt-4"
              preventDisabled={isLoading}
              placeholder="Ссылка на желание"
              label="Ссылка на желание"
              required
            />
          </div>
          <div>
            <TextFieldContainer
              {...descriptionField}
              className="w-full mt-4"
              preventDisabled={isLoading}
              placeholder="Описание желания"
              type="textarea"
              label="Описание желания"
            />
          </div>
          <div>
            <Alert severity="warning">
              К сожалению, сылку на изображение пока можно отредактировать только в самом боте
            </Alert>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-400 my-2" />
        <div className="gap-4 mt-2 flex justify-between">
          <Button color="primary" size="small" type="submit" variant="text" disabled={isLoading}>
            Сохранить
          </Button>

          <Button color="primary" type="button" size="small" variant="text" onClick={onCancel} disabled={isLoading}>
            Отменить
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
