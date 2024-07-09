import { Alert, Button } from '@mui/material'
import { useCallback, useMemo } from 'react'
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

type Form = WishDto | (Omit<WishDto, 'categoryId'> & { categoryId: Category | WishDto['categoryId'] })

type Props = {
  wish?: Wish
  definedKey?: string
  wishImage?: File
  isImageDeleted?: boolean
  onCancel?: () => void
}

export const WishForm = (props: Props) => {
  const { wish, definedKey, wishImage, isImageDeleted, onCancel } = props
  const { user } = useAuth()
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
  const { errors } = formState
  const categoryId = watch('categoryId')

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
    } catch (error) {
      console.error(error)
    }
  })

  const { handleCreatePopup, isLoading: isLoadingCreate } = useWishCreate(definedKey, async (wish) => {
    try {
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
    } catch (error) {
      console.error(error)
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
        value: 160,
        message: 'Максимум 160 символов',
      },
    }),
    errors,
    withRef: false,
  })

  const descriptionField = useRegister({
    ...register('description', {
      maxLength: {
        value: 600,
        message: 'Максимум 600 символов',
      },
    }),
    errors,
    withRef: false,
  })

  const categoryField = useRegister({
    ...register('categoryId', {
      maxLength: {
        value: 160,
        message: 'Максимум 160 символов',
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
          <div>
            <AutocompleteFieldContainer
              {...categoryField}
              options={categoryOptions || []}
              disabled={isLoading || isLoadingCategories}
              realValue={categoryValue}
              fullWidth
              isLoading={isLoadingCategories}
              label="Категория желания"
              noOptionsText="Ни одной категории еще не создавалось"
              id="wish-category-list"
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
