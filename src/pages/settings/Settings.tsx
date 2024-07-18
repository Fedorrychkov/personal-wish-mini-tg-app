import { Button } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { SaveEmoji } from '~/assets'
import { getBackgroundStyle, getPatterns } from '~/components/background'
import { TextFieldContainer } from '~/components/fields'
import { Spinner } from '~/components/loaders'
import { UserHeader } from '~/components/user'
import { useRegister, useTgBack } from '~/hooks'
import { DefaultLayout } from '~/layouts/default'
import { useAuth, useCustomization } from '~/providers'
import { useUserCustomizationCreateMutation } from '~/query/customization'
import { ROUTE } from '~/router'
import { cn } from '~/utils'

const patterns = getPatterns()

type Form = {
  title: string
}

export const Settings = () => {
  useTgBack({ defaultBackPath: ROUTE.home })

  const { user, isLoadingCustomization } = useAuth()
  const { updateUserCustomizationId, customization } = useCustomization()

  useEffect(() => {
    updateUserCustomizationId(user?.id)
  }, [user?.id, updateUserCustomizationId])

  const [patternName, setPatternName] = useState<string | undefined>(customization?.patternName || undefined)

  const customizationMutation = useUserCustomizationCreateMutation(user?.id)

  const defaultTitle = `Вишлист | @${user?.username || user?.id}`
  const form = useForm<Form>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      title: customization?.title || defaultTitle,
    },
  })

  const { handleSubmit, register, setValue, formState } = form
  const { errors } = formState

  useEffect(() => {
    setPatternName(customization?.patternName)
    setValue('title', customization?.title || defaultTitle)
  }, [customization, defaultTitle, setValue])

  const handleUpdatePatterName = useCallback(
    (patternName?: string) => {
      setPatternName(patternName)

      customizationMutation.mutateAsync({
        id: customization?.id,
        patternName: patternName,
        title: customization?.title,
      })
    },
    [customization, customizationMutation],
  )

  const titleField = useRegister({
    ...register('title', {
      required: {
        value: true,
        message: 'Название вишлиста обязательно',
      },
      maxLength: {
        value: 160,
        message: 'Максимум 160 символов',
      },
    }),
    errors,
    withRef: false,
  })

  const onSubmit = useCallback(
    async (payload: Form) => {
      customizationMutation.mutateAsync({
        id: customization?.id,
        patternName: patternName,
        title: payload?.title,
      })
    },
    [customization, patternName, customizationMutation],
  )

  return (
    <DefaultLayout className="!px-0">
      <UserHeader className="self-center bg-gray-200 dark:bg-slate-400 w-full py-4" editable={false} />
      <div className="px-4">
        <div className="py-4 flex justify-between items-center">
          <h3 className="text-xl bold text-slate-900 dark:text-white mt-2">Настройки</h3>
        </div>

        <div className="w-full h-[1px] bg-gray-400" />

        <div className="mt-2 mb-4 gap-4">
          {isLoadingCustomization ? (
            <>
              <Spinner />
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="bg-slate-200 dark:bg-slate-600 p-2 rounded-lg">
                <p className="text-md bold text-slate-900 dark:text-white">Настройки категорий</p>
                <Link to={ROUTE.categorySettings} className="text-sm bold text-blue-500 dark:text-blue-200">
                  Мои списки категорий
                </Link>
                <p className="text-md bold text-slate-900 dark:text-white my-4">Кастомизация названия</p>
                <FormProvider {...form}>
                  <form className="pt-0 mb-4" onSubmit={handleSubmit(onSubmit)}>
                    <TextFieldContainer
                      {...titleField}
                      className="w-full mt-4"
                      preventDisabled={customizationMutation.isLoading}
                      placeholder="Название списка на главной"
                      label="Название списка на главной"
                      endAdornment={
                        customizationMutation.isLoading ? (
                          <div>
                            <Spinner className="!w-[12px] !h-[12px]" />
                          </div>
                        ) : (
                          <Button
                            color="primary"
                            size="small"
                            type="submit"
                            variant="text"
                            disabled={customizationMutation.isLoading}
                          >
                            Сохранить
                          </Button>
                        )
                      }
                      required
                    />
                  </form>
                </FormProvider>
              </div>
              <div className="bg-slate-200 dark:bg-slate-600 p-2 rounded-lg">
                <p className="text-md bold text-slate-900 dark:text-white mb-4">Кастомизация фона</p>
                <div className="flex gap-4 flex-wrap flex-col h-[220px] overflow-hidden overflow-x-auto">
                  <button
                    className={cn(
                      'w-[100px] h-[100px] bg-gray-200 dark:bg-slate-400 rounded-lg relative opacity-[0.7]',
                      {
                        'opacity-[1]': !patternName,
                      },
                    )}
                    onClick={() => handleUpdatePatterName('')}
                  >
                    {!patternName && <SaveEmoji className="absolute top-[5px] right-[5px]" />}
                  </button>
                  {patterns?.map((patternNameValue) => (
                    <button
                      key={patternNameValue}
                      style={getBackgroundStyle(patternNameValue)}
                      onClick={() => handleUpdatePatterName(patternNameValue)}
                      className={cn(
                        'w-[100px] h-[100px] bg-gray-200 dark:bg-slate-400 rounded-lg relative opacity-[0.7]',
                        {
                          'opacity-[1]': patternName === patternNameValue,
                        },
                      )}
                    >
                      {patternName === patternNameValue && <SaveEmoji className="absolute top-[5px] right-[5px]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  )
}
