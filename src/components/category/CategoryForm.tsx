import { Alert, Button, FormControlLabel, Switch } from '@mui/material'
import { useCallback } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'

import { Category, CategoryDto } from '~/entities'
import { useRegister } from '~/hooks'

import { TextFieldContainer } from '../fields'
import { Spinner } from '../loaders'
import { useCategoryCreate, useCategoryDelete, useCategoryUpdate } from './hooks'

type Props = {
  category?: Category
  definedKey?: string
  onCancel?: () => void
}

export const CategoryForm = (props: Props) => {
  const { category, definedKey, onCancel } = props

  const isNew = !category

  const form = useForm<CategoryDto>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: category?.name || '',
      isPrivate: category?.isPrivate ?? false,
    },
  })

  const { handleSubmit, formState, register } = form
  const { errors } = formState

  const { isLoading: isLoadingUpdates, handleUpdatePopup } = useCategoryUpdate(category?.id || '', definedKey, () => {
    setTimeout(() => {
      onCancel?.()
    }, 1000)
  })

  const { isLoading: isLoadingCreation, handleCreatePopup } = useCategoryCreate(definedKey, () => {
    setTimeout(() => {
      onCancel?.()
    }, 1000)
  })

  const { isLoading: isLoadingDeletion, handleDeletePopup } = useCategoryDelete(category, definedKey, () => {
    setTimeout(() => {
      onCancel?.()
    }, 1000)
  })

  const isLoading = isLoadingDeletion || isLoadingUpdates || isLoadingCreation

  const onSubmit = useCallback(
    (payload: CategoryDto) => {
      if (isNew) {
        handleCreatePopup(payload)
      } else {
        handleUpdatePopup(payload)
      }
    },
    [handleUpdatePopup, handleCreatePopup, isNew],
  )

  const nameField = useRegister({
    ...register('name', {
      required: {
        value: true,
        message: 'Название категории обязательно',
      },
      maxLength: {
        value: 200,
        message: 'Максимум 200 символов',
      },
    }),
    errors,
    withRef: false,
  })

  const isPrivateField = useRegister({
    ...register('isPrivate'),
    errors,
    withRef: false,
  })

  return (
    <FormProvider {...form}>
      <form className="pt-0" onSubmit={handleSubmit(onSubmit)}>
        <div className="gap-4 flex flex-col">
          {category && (
            <div className="mb-4">
              <Button
                type="button"
                color="error"
                size="small"
                onClick={() => handleDeletePopup(category?.id)}
                variant="text"
                disabled={isLoading}
              >
                {isLoading ? <Spinner /> : 'Удалить категорию'}
              </Button>
              <Alert severity="warning" className="mt-4">
                Удаление категории сбросит желания в общий список, приватные желания станут доступны публично. Убедитесь
                перед удалением, что не возникнет неблагоприятных последствий.
              </Alert>
            </div>
          )}
          <div>
            <TextFieldContainer
              {...nameField}
              className="w-full mt-4"
              preventDisabled={false}
              placeholder="Название категории"
              label="Название категории"
              required
            />
          </div>
          <div>
            <FormControlLabel
              className="w-full"
              control={
                <Controller
                  {...isPrivateField}
                  render={({ field: { value, onChange: defaultOnChange } }) => (
                    <>
                      <Switch checked={value} value={value} disabled={isLoading} onChange={defaultOnChange} />
                    </>
                  )}
                />
              }
              label="Приватнай список"
            />
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-400 mt-4" />
        <div className="gap-4 mt-2 flex justify-between">
          <Button color="primary" size="small" type="submit" variant="text" disabled={isLoading}>
            {isLoading ? <Spinner /> : isNew ? 'Создать' : 'Обновить'}
          </Button>

          <Button color="primary" type="button" size="small" variant="text" onClick={onCancel}>
            Назад
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
