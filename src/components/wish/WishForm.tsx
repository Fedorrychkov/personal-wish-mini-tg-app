import { Alert, Button } from '@mui/material'
import { initPopup } from '@tma.js/sdk'
import { KeyboardEvent, useCallback, useMemo, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Category } from '~/entities'
import { Wish, WishDto } from '~/entities/wish'
import { useRegister } from '~/hooks'
import { useNotifyContext } from '~/providers'
import { useAuth } from '~/providers/auth'
import {
  useUserCategoryCreateMutation,
  useUserCategoryQuery,
  useUserDataQuery,
  useUserWishImageMutation,
} from '~/query'
import { URL_REGEXP } from '~/utils'

import { AutocompleteFieldContainer, TextFieldContainer } from '../fields'
import { useWishUpdate } from './hooks'
import { useWishCreate } from './hooks/useWishCreate'

const fieldQueue = ['name', 'link', 'description', 'categoryId']

type Form = WishDto | (Omit<WishDto, 'categoryId'> & { categoryId: Category | WishDto['categoryId'] })

type Props = {
  wish?: Wish
  definedKey?: string
  wishImage?: File
  isImageDeleted?: boolean
  onCancel?: () => void
}

export const WishForm = (props: Props) => {
  const popup = initPopup()

  const { wish, definedKey, wishImage, isImageDeleted, onCancel } = props
  const { user } = useAuth()
  const formRef = useRef<HTMLFormElement | null>(null)
  const { setNotify } = useNotifyContext()
  const isOwner = user?.id === wish?.userId
  const { data: wishUserOwner } = useUserDataQuery(wish?.userId || '', wish?.userId, !isOwner)
  const { upload, remove } = useUserWishImageMutation(definedKey)
  const {
    data: categories,
    isLoading: isLoadingCategories,
    key: categoryDefinedKey,
  } = useUserCategoryQuery(wish?.userId || '')
  const createCategory = useUserCategoryCreateMutation(categoryDefinedKey)

  const categoryOptions = useMemo(
    () => categories?.map((category) => ({ ...category, inputValue: category.name, title: category.name })),
    [categories],
  )

  const isLoadingImage = upload.isLoading || remove.isLoading

  const form = useForm<Form>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: wish?.name || '',
      description: wish?.description || '',
      link: wish?.link || '',
      imageUrl: wish?.imageUrl || '',
      categoryId: wish?.categoryId || '',
    },
  })

  const { handleSubmit, register, watch, formState } = form
  const { errors, isDirty } = formState
  const categoryId = watch('categoryId')

  const handleCancel = useCallback(() => {
    if (!isDirty) {
      onCancel?.()

      return
    }

    popup
      .open({
        title: 'Вы уверены, что хотите отменить изменения?',
        message: 'Вы потеряете все изменения, которые вы сделали в этом желании',
        buttons: [
          { id: 'ok', type: 'default', text: 'Отменить' },
          { id: 'cancel', type: 'destructive', text: 'Назад' },
        ],
      })
      .then((buttonId) => {
        if (!buttonId || buttonId === 'cancel') {
          return
        }

        onCancel?.()
        setNotify('Изменения отменены', { severity: 'success' })
      })
  }, [onCancel, setNotify, popup, isDirty])

  const categoryValue = useMemo(() => {
    const option = categoryOptions?.find((category) =>
      typeof categoryId === 'string' ? category.id === categoryId : false,
    )

    return option
  }, [categoryOptions, categoryId])

  const { handleUpdatePopup, isLoading: isLoadingUpdare } = useWishUpdate(wish, definedKey, async (wish) => {
    try {
      if (isImageDeleted && wish?.imageUrl && !wishImage) {
        await remove?.mutateAsync(wish?.id || '')
      }

      if (wishImage) {
        try {
          await upload?.mutateAsync({ id: wish.id, file: wishImage })
          onCancel?.()
          setNotify('Изображение успешно установлено', { severity: 'success' })
        } catch (error) {
          setNotify('Произошла ошибка сохранения изображения, попробуйте еще раз или выберите другое изображение', {
            severity: 'error',
          })
          console.error(error)
        }

        return
      }

      onCancel?.()

      setNotify('Желание успешно обновлено', { severity: 'success' })
    } catch (error) {
      console.error(error)
      setNotify('Произошла непредвиденная ошибка', { severity: 'error' })
    }
  })

  const { handleCreatePopup, isLoading: isLoadingCreate } = useWishCreate(definedKey, async (wish) => {
    try {
      if (wishImage) {
        try {
          await upload?.mutateAsync({ id: wish.id, file: wishImage })
          onCancel?.()

          setNotify('Желание успешно создано с изображением установлено', { severity: 'success' })
        } catch (error) {
          setNotify('Произошла ошибка сохранения изображения, попробуйте еще раз или выберите другое изображение', {
            severity: 'error',
          })
          console.error(error)
        }

        return
      }

      onCancel?.()

      setNotify('Желание успешно создано', { severity: 'success' })
    } catch (error) {
      console.error(error)
      setNotify('Произошла непредвиденная ошибка', { severity: 'error' })
    }
  })

  const isLoading = isLoadingUpdare || isLoadingCreate || isLoadingImage

  const onSubmit = useCallback(
    async (payload: Form) => {
      let categoryId = typeof payload.categoryId !== 'string' ? payload.categoryId?.id : null
      const newCategory = typeof payload.categoryId === 'string' ? payload.categoryId : null
      const isExistCategory = !!categories?.find((category) => newCategory === category?.id)

      if (!isExistCategory && newCategory) {
        const category = await createCategory.mutateAsync({ name: newCategory })
        categoryId = category.id
      }

      if (wish) {
        handleUpdatePopup({ ...payload, categoryId })
      } else {
        handleCreatePopup({ ...payload, categoryId })
      }
    },
    [handleUpdatePopup, handleCreatePopup, createCategory, wish, categories],
  )

  const nameField = useRegister({
    ...register('name', {
      required: {
        value: true,
        message: 'Название желания обязательно',
      },
      maxLength: {
        value: 560,
        message: 'Максимум 560 символов',
      },
    }),
    errors,
    withRef: false,
  })

  const descriptionField = useRegister({
    ...register('description', {
      maxLength: {
        value: 1600,
        message: 'Максимум 1600 символов',
      },
    }),
    errors,
    withRef: false,
  })

  const categoryField = useRegister({
    ...register('categoryId', {
      maxLength: {
        value: 360,
        message: 'Максимум 360 символов',
      },
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

  const handlePressKey = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    const keyCode = e.which || e.keyCode

    if (keyCode === 13) {
      const currentIndex = fieldQueue?.findIndex((name) => name === (e as any).target?.name)
      const nextIndex = currentIndex < fieldQueue?.length - 1 ? currentIndex + 1 : undefined

      if (typeof nextIndex !== 'undefined') {
        e.preventDefault()
        e.stopPropagation()

        const name = fieldQueue?.[nextIndex]

        const field = document?.querySelector(`[name=${name}]`)

        if (field instanceof HTMLInputElement) {
          field?.focus?.()
        }

        if (field instanceof HTMLTextAreaElement) {
          field?.focus?.()
        }
      }

      if (typeof nextIndex === 'undefined' && formRef?.current && formRef?.current instanceof HTMLFormElement) {
        const name = fieldQueue?.[currentIndex]

        const field = document?.querySelector(`[name=${name}]`)

        if (field instanceof HTMLInputElement) {
          field?.blur?.()
        }

        if (field instanceof HTMLTextAreaElement) {
          field?.blur?.()
        }

        const submitButton = formRef?.current?.querySelector('[type="submit"]')

        if (submitButton instanceof HTMLButtonElement) {
          submitButton?.focus?.()
        }
      }

      return false
    }
  }, [])

  return (
    <FormProvider {...form}>
      <div className="p-4">
        <Alert severity="warning">
          Для установки/редактирования изображения нажмите на иконку карандаша. <br /> Чтобы сохранить изменения по
          изображению нажмите на зеленую галочку
        </Alert>
      </div>
      <form
        className="p-4 pt-0 bg-slate-200/[.5] dark:bg-slate-900/[.5]"
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
      >
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
              textFieldProps={{
                onKeyDown: handlePressKey,
              }}
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
              textFieldProps={{
                onKeyDown: handlePressKey,
              }}
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
              textFieldProps={{
                onKeyDown: handlePressKey,
              }}
            />
          </div>
          <div>
            <AutocompleteFieldContainer
              {...categoryField}
              options={categoryOptions || []}
              disabled={isLoading || isLoadingCategories}
              realValue={categoryValue}
              fullWidth
              isLoading={isLoadingCategories}
              textFielProps={{
                onKeyDown: handlePressKey,
              }}
              label="Категория желания"
              noOptionsText="Ни одной категории еще не создавалось"
            />
            {typeof categoryId !== 'string' && categoryId?.isPrivate && (
              <Alert severity="info" className="mt-4">
                Выбрана приватная категория, желание будет доступно только приглашенным в эту категорию пользователям.
                Внести изменения в категорию можно на странице настроек категории
              </Alert>
            )}
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-400 my-4" />
        <div className="gap-4 mt-2 flex flex-col">
          <Button
            color="primary"
            size="small"
            type="submit"
            className="w-full"
            variant="contained"
            disabled={isLoading}
          >
            {wish ? 'Сохранить' : 'Создать'}
          </Button>

          <Button
            color="primary"
            type="button"
            size="small"
            className="w-full"
            variant="text"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Отменить
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
