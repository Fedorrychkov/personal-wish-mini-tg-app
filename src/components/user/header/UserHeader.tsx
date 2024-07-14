import { Skeleton } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { SettingsEmoji, UploadEmoji } from '~/assets'
import { getBackgroundStyle } from '~/components/background'
import { ImageLoader } from '~/components/image'
import { Avatar } from '~/components/placeholder'
import { UploadContainer } from '~/components/upload-file'
import { User } from '~/entities'
import { useAuth, useCustomization, useNotifyContext } from '~/providers'
import { useUserAvatarMutation } from '~/query'
import { ROUTE } from '~/router'
import { cn } from '~/utils'

type Props = {
  className?: string
  user?: User
  isLoading?: boolean
  editable?: boolean
}

export const UserHeader = ({ className, user: definedUser, isLoading, editable = true }: Props) => {
  const { user, currentUserKey } = useAuth()
  const { upload, remove } = useUserAvatarMutation(currentUserKey)
  const { setNotify } = useNotifyContext()
  const navigate = useNavigate()

  const [isEditabledMode, setEditabledMode] = useState(false)

  const { updateUserCustomizationId, customization } = useCustomization()

  const finalUser = definedUser || user

  const isOwner = !definedUser

  useEffect(() => {
    updateUserCustomizationId(finalUser?.id)
  }, [finalUser, updateUserCustomizationId])

  const isLoadingState = upload.isLoading || remove.isLoading || isLoading

  const [avatarSrc, setAvatarSrc] = useState<string | undefined | null>(finalUser?.avatarUrl)

  const userAvatarPlaceholder = useMemo(() => {
    if (finalUser?.firstName && finalUser?.lastName) {
      const firstNameChar = finalUser?.firstName?.trim?.()?.[0]?.toUpperCase?.()
      const lastNameChar = finalUser?.lastName?.trim?.()?.[0]?.toUpperCase?.()

      return `${firstNameChar}.${lastNameChar}.`
    }

    if (finalUser?.username) {
      return finalUser?.username?.slice(0, 4)
    }

    return 'Пусто'
  }, [finalUser])

  const handleSaveAvatarImage = useCallback(
    async (file: File | undefined) => {
      if (!file) {
        await remove?.mutateAsync()

        return
      }

      try {
        await upload?.mutateAsync(file)
        setNotify('Изображение успешно установлено', { severity: 'success' })
      } catch (error) {
        setNotify('Произошла ошибка сохранения изображения, попробуйте еще раз или выберите другое изображение', {
          severity: 'error',
        })
        console.error(error)

        throw error
      }

      return
    },
    [upload, remove, setNotify],
  )

  const handleOpenCustomization = useCallback(() => {
    navigate(ROUTE.settings)
  }, [navigate])

  return (
    <div
      className={cn('flex flex-col items-center custom', className)}
      style={getBackgroundStyle(customization?.patternName)}
    >
      <UploadContainer
        enabled={editable ? isOwner : false}
        defaultIsEditable={isEditabledMode}
        onUpdateImageSrc={setAvatarSrc}
        onRevert={() => setAvatarSrc(finalUser?.avatarUrl)}
        onSave={handleSaveAvatarImage}
        onToggleEditable={setEditabledMode}
        isDeletable={!!avatarSrc}
        isLoading={isLoadingState}
        editProps={{
          className: 'top-[-10px] right-[-10px]',
        }}
        uploadLabel={
          <div className="h-[80px] flex justify-center items-center px-4 gap-4 relative">
            <div className="flex items-center justify-center bg-slate-500 w-[80px] min-w-[80px] h-[80px] rounded-[50%] hover:bg-slate-800">
              <ImageLoader
                defaultPlaceholder={
                  <Avatar text={userAvatarPlaceholder} className="w-[80px] h-[80px] rounded-[50%] opacity-[0.6]" />
                }
                src={avatarSrc || ''}
                className="w-[80px] h-[80px] object-cover rounded-[50%] opacity-[0.6]"
                alt={`Avatar of ${finalUser?.username}`}
                isLoading={isLoading}
              />
              <UploadEmoji className="text-3xl absolute" />
            </div>
            <p className="max-w-[320px] text-slate-900 dark:text-white">
              Загрузите одно изображение в формате (jpeg/png/webp/heic) не больше 20mb
            </p>
          </div>
        }
      >
        <ImageLoader
          defaultPlaceholder={<Avatar text={userAvatarPlaceholder} className="w-[80px] h-[80px] rounded-[50%]" />}
          src={avatarSrc || ''}
          className="w-[80px] h-[80px] object-cover rounded-[50%]"
          alt={`Avatar of ${finalUser?.username}`}
          isLoading={isLoading}
        />
      </UploadContainer>

      {isLoading ? (
        <Skeleton className="mt-1" variant="rectangular" width={100} height={28} />
      ) : (
        <>
          {isOwner && !isEditabledMode && editable && (
            <button
              type="button"
              className="absolute top-[12px] right-[12px] border-none bg-slate-200 dark:bg-slate-300 rounded-[50%] w-[40px] h-[40px] hover:opacity-[0.8]"
              title="Настройки"
              onClick={handleOpenCustomization}
            >
              <SettingsEmoji />
            </button>
          )}
          <p className="text-lg text-slate-900 dark:text-white">
            {customization?.title ? customization?.title : <>Вишлист | @{finalUser?.username || finalUser?.id}</>}
          </p>
        </>
      )}
    </div>
  )
}
