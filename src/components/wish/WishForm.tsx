import { Alert, Button } from '@mui/material'
import { useCallback } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Wish, WishDto } from '~/entities/wish'
import { useRegister } from '~/hooks'
import { useAuth } from '~/providers/auth'
import { useUserDataQuery, useUserWishImageMutation } from '~/query'
import { URL_REGEXP } from '~/utils'

import { TextFieldContainer } from '../fields'
import { useWishUpdate } from './hooks'
import { useWishCreate } from './hooks/useWishCreate'

type Props = {
  wish?: Wish
  definedKey?: string
  wishImage?: File
  onCancel?: () => void
}

export const WishForm = ({ wish, definedKey, wishImage, onCancel }: Props) => {
  const { user } = useAuth()
  const isOwner = user?.id === wish?.userId
  const { data: wishUserOwner } = useUserDataQuery(wish?.userId || '', wish?.userId, !isOwner)
  const { upload, remove } = useUserWishImageMutation(definedKey)

  const isLoadingImage = upload.isLoading || remove.isLoading

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

  const { handleUpdatePopup, isLoading: isLoadingUpdare } = useWishUpdate(wish, definedKey, async (wish) => {
    try {
      if (wish?.imageUrl && !wishImage) {
        await remove?.mutateAsync(wish?.id || '')
      }

      if (wishImage) {
        await upload?.mutateAsync({ id: wish.id, file: wishImage })
      }

      onCancel?.()
    } catch (error) {
      console.error(error)
    }
  })

  const { handleCreatePopup, isLoading: isLoadingCreate } = useWishCreate(definedKey, async (wish) => {
    try {
      if (wishImage) {
        await upload?.mutateAsync({ id: wish.id, file: wishImage })
      }

      onCancel?.()
    } catch (error) {
      console.error(error)
    }
  })

  const isLoading = isLoadingUpdare || isLoadingCreate || isLoadingImage

  const onSubmit = useCallback(
    async (payload: WishDto) => {
      if (wish) {
        handleUpdatePopup(payload)
      } else {
        handleCreatePopup(payload)
      }
    },
    [handleUpdatePopup, handleCreatePopup, wish],
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
      <div className="py-4">
        <Alert severity="warning">
          Для установки/редактирования изображения нажмите на иконку карандаша. <br /> Чтобы сохранить изменения по
          изображению нажмите на зеленую галочку
        </Alert>
      </div>
      <form className="p-4 pt-0" onSubmit={handleSubmit(onSubmit)}>
        <div className="py-4">
          <div className="gap-4 mt-1 flex items-baseline">
            {wish && (
              <div className="text-sm bold text-slate-700 dark:text-slate-400">
                {isOwner ? 'Мое желание' : `Желание пользователя @${wishUserOwner?.username}`}
              </div>
            )}
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
        </div>

        <div className="w-full h-[1px] bg-gray-400 my-2" />
        <div className="gap-4 mt-2 flex justify-between">
          <Button color="primary" size="small" type="submit" variant="text" disabled={isLoading}>
            {wish ? 'Сохранить' : 'Создать'}
          </Button>

          <Button color="primary" type="button" size="small" variant="text" onClick={onCancel} disabled={isLoading}>
            Отменить
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
