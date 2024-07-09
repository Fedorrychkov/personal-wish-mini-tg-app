import { Skeleton } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'

import { UploadEmoji } from '~/assets'
import { ImageLoader } from '~/components/image'
import { Avatar } from '~/components/placeholder'
import { UploadContainer } from '~/components/upload-file'
import { User } from '~/entities'
import { useAuth, useNotifyContext } from '~/providers'
import { useUserAvatarMutation } from '~/query'
import { cn } from '~/utils'

type Props = {
  className?: string
  user?: User
  isLoading?: boolean
}

export const UserHeader = ({ className, user: definedUser, isLoading }: Props) => {
  const { user, currentUserKey } = useAuth()
  const { upload, remove } = useUserAvatarMutation(currentUserKey)
  const { setNotify } = useNotifyContext()

  const finalUser = definedUser || user

  const isOwner = !definedUser
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

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <UploadContainer
        enabled={isOwner}
        onUpdateImageSrc={setAvatarSrc}
        onRevert={() => setAvatarSrc(finalUser?.avatarUrl)}
        onSave={handleSaveAvatarImage}
        isDeletable={!!avatarSrc}
        isLoading={isLoadingState}
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
        <p className="text-lg text-slate-900 dark:text-white">Вишлист | @{finalUser?.username}</p>
      )}
    </div>
  )
}
