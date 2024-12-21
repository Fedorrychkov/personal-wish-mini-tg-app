import { Skeleton } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { matchPath, useNavigate } from 'react-router-dom'

import { SettingsEmoji, ShareEmoji, UploadEmoji } from '~/assets'
import { PatternBackground } from '~/components/background'
import { ImageLoader } from '~/components/image'
import { Avatar } from '~/components/placeholder'
import { UploadContainer } from '~/components/upload-file'
import { User } from '~/entities'
import { useScrollController } from '~/hooks'
import { ONBOARDING_DATA_NAME, useAuth, useCustomization, useNotifyContext } from '~/providers'
import { useUserAvatarMutation, useUserFavoriteSubscribesQuery, useUserWishListCountQuery } from '~/query'
import { ROUTE } from '~/router'
import { cn, shareTgLink } from '~/utils'

type Props = {
  className?: string
  user?: User
  isLoading?: boolean
  editable?: boolean
  categoryId?: string
}

export const UserHeader = ({ className, user: definedUser, isLoading, editable = true, categoryId }: Props) => {
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

  const handleShare = useCallback(() => {
    const payload = JSON.stringify(categoryId ? { cId: categoryId } : { id: finalUser?.id })

    shareTgLink(payload)
  }, [finalUser?.id, categoryId])

  const { data: wishListCount } = useUserWishListCountQuery(finalUser?.id)
  const { data: subscribes } = useUserFavoriteSubscribesQuery(finalUser?.id || '', 'subscribes', !!finalUser?.id)
  const { data: subscribers } = useUserFavoriteSubscribesQuery(finalUser?.id || '', 'subscribers', !!finalUser?.id)

  // useEffect(() => {
  //   if (!isLoading) {
  //     setIsOpen(true)
  //   }
  // }, [setIsOpen, isLoading])

  const { scrollToHash } = useScrollController('data-scroll-container="wish-list"')

  const isWishList = !!matchPath(ROUTE.userWishList, location.pathname) || !!matchPath(ROUTE.home, location.pathname)

  const meta = useMemo(() => {
    return [
      {
        title: 'Желаний',
        value: wishListCount?.count || 0,
        onClick: () => {
          if (isWishList) {
            scrollToHash()
          } else {
            navigate(finalUser?.id === user?.id ? ROUTE.home : ROUTE.userWishList?.replace(':id', finalUser?.id || ''))
          }
        },
      },
      {
        title: 'Подписчиков',
        value: subscribers?.length || 0,
        onClick: () => {
          navigate(ROUTE.subscribeRoot?.replace(':id', finalUser?.id || ''), {
            state: {
              type: 'subscribers',
            },
          })
        },
      },
      {
        title: 'Подписки',
        value: subscribes?.length || 0,
        onClick: () => {
          navigate(ROUTE.subscribeRoot?.replace(':id', finalUser?.id || ''), {
            state: {
              type: 'subscribes',
            },
          })
        },
      },
    ]
  }, [wishListCount, subscribes, subscribers, finalUser?.id, user?.id, isWishList, scrollToHash, navigate])

  return (
    <div className={cn('flex flex-col items-center relative', className)}>
      <PatternBackground patternName={customization?.patternName} className="absolute" />
      <div className={cn('flex flex-col items-center z-[1] relative w-full')}>
        <div className="flex flex-row items-center justify-center w-full gap-4">
          <div className="flex flex-col items-center relative" data-tour={ONBOARDING_DATA_NAME.mainUserEditAvatar}>
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
                        <Avatar
                          text={userAvatarPlaceholder}
                          className="w-[80px] h-[80px] rounded-[50%] opacity-[0.6]"
                        />
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
          </div>
          {!isEditabledMode && (
            <div
              className="flex flex-col items-start gap-1"
              {...(isWishList ? { 'data-tour': ONBOARDING_DATA_NAME.userSocial } : {})}
            >
              <p className="text-lg text-slate-900 bold dark:text-white">
                {finalUser?.username
                  ? `@${finalUser?.username}`
                  : `${finalUser?.firstName || ''} ${finalUser?.lastName || ''}`}
              </p>

              <div className="flex flex-row items-center gap-2 justify-center">
                {meta?.map((item) => (
                  <button
                    key={item.title}
                    className="flex flex-col items-center gap-1 bg-transparent border-0 cursor-pointer"
                    onClick={item.onClick}
                  >
                    <p className="text-md text-slate-900 font-bold dark:text-white">{item.value}</p>
                    <p className="text-xs text-slate-900 dark:text-white">{item.title}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <Skeleton className="mt-1" variant="rectangular" width={100} height={28} />
        ) : (
          <>
            {isOwner && !isEditabledMode && editable && (
              <button
                type="button"
                className="absolute top-[-12px] right-[12px] border-none bg-slate-200 dark:bg-slate-300 rounded-[50%] w-[40px] h-[40px] hover:opacity-[0.8]"
                title="Настройки"
                data-tour={ONBOARDING_DATA_NAME.wishMainSettingsData}
                onClick={handleOpenCustomization}
              >
                <SettingsEmoji />
              </button>
            )}
            {isWishList && (
              <div className="flex items-center gap-2">
                <p
                  className="text-lg text-slate-900 bold dark:text-white"
                  data-tour={ONBOARDING_DATA_NAME.wishMainTitleData}
                >
                  {customization?.title ? customization?.title : <>Вишлист | @{finalUser?.username || finalUser?.id}</>}
                </p>

                <button
                  type="button"
                  className="border-none bg-slate-200 dark:bg-slate-300 rounded-[50%] w-[40px] h-[40px] hover:opacity-[0.8]"
                  title="Поделиться"
                  data-tour={ONBOARDING_DATA_NAME.wishMainTitleShareData}
                  onClick={handleShare}
                >
                  <ShareEmoji className="text-lg" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
