import { Alert, Button, FormControlLabel, Skeleton, Switch } from '@mui/material'
import { useCallback } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import { useCategoryUpdate } from '~/components/category/hooks'
import { TextFieldContainer } from '~/components/fields'
import { Spinner } from '~/components/loaders'
import { UserHeader } from '~/components/user'
import { CategoryDto } from '~/entities'
import { useRegister, useTgBack } from '~/hooks'
import { DefaultLayout } from '~/layouts/default'
import { useAuth } from '~/providers'
import { useCategoryQuery } from '~/query'
import { ROUTE } from '~/router'

export const Category = () => {
  useTgBack({ defaultBackPath: ROUTE.categorySettings })

  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const form = useForm<CategoryDto>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      isPrivate: false,
    },
  })

  const { setValue, handleSubmit, formState, register } = form
  const { errors } = formState

  const {
    data: category,
    isLoading: isCategoryLoading,
    key: definedCategoryKey,
  } = useCategoryQuery(id || '', !!id, {
    onSuccess: (category) => {
      setValue('name', category?.name || '')
      setValue('isPrivate', category?.isPrivate ?? false)
    },
  })

  const handleBackToSettings = useCallback(() => {
    navigate(ROUTE.categorySettings)
  }, [navigate])

  const { isLoading, handleUpdatePopup } = useCategoryUpdate(category?.id || '', definedCategoryKey, () => {
    setTimeout(() => {
      handleBackToSettings()
    }, 1000)
  })

  const onSubmit = useCallback(
    (payload: CategoryDto) => {
      handleUpdatePopup(payload)
    },
    [handleUpdatePopup],
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

  if (category && category?.userId !== user?.id) {
    return (
      <DefaultLayout className="!px-0">
        <UserHeader className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4" editable={false} />

        <Alert
          severity="info"
          className="dark:!bg-slate-300 mt-4"
          action={
            <Button color="primary" type="button" onClick={handleBackToSettings} size="small" variant="text">
              К настройке списков
            </Button>
          }
        >
          Категория не пренадлежит вам, вернитесь в свой список категорий для продолжения
        </Alert>
      </DefaultLayout>
    )
  }

  if (!category && !isCategoryLoading) {
    return (
      <DefaultLayout className="!px-0">
        <UserHeader className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4" editable={false} />

        <Alert
          severity="info"
          className="dark:!bg-slate-300 mt-4"
          action={
            <Button color="primary" type="button" onClick={handleBackToSettings} size="small" variant="text">
              К настройке списков
            </Button>
          }
        >
          Не удалось получить категорию, вернитесь к списку категорий для продолжения
        </Alert>
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout className="!px-0">
      <UserHeader className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4" editable={false} />
      <div className="px-4">
        <div className="py-4 flex justify-between items-center">
          <h3 className="text-xl bold text-slate-900 dark:text-white mt-2">Настройка категории (списка)</h3>
        </div>

        <div className="w-full h-[1px] bg-gray-400" />

        <div className="bg-slate-200 dark:bg-slate-600 p-4 rounded-lg my-4">
          {isCategoryLoading && !category ? (
            <Skeleton className="rounded-lg" variant="rectangular" width={'100%'} height={40} />
          ) : (
            <FormProvider {...form}>
              <form className="pt-0" onSubmit={handleSubmit(onSubmit)}>
                <div className="gap-4 flex flex-col">
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

                    <Alert severity="warning" className="mt-4">
                      Приватность категории на данный момент не работает, ожидайте обновление в течении Июля
                    </Alert>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-gray-400 mt-4" />
                <div className="gap-4 mt-2 flex justify-between">
                  <Button color="primary" size="small" type="submit" variant="text" disabled={isLoading}>
                    {isLoading ? <Spinner /> : 'Обновить'}
                  </Button>

                  <Button color="primary" type="button" size="small" variant="text" onClick={handleBackToSettings}>
                    Назад
                  </Button>
                </div>
              </form>
            </FormProvider>
          )}
        </div>
      </div>
    </DefaultLayout>
  )
}
