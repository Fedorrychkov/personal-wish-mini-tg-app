import { useCallback, useState } from 'react'

import { UploadEmoji } from '~/assets'
import { Wish } from '~/entities/wish'
import { useCustomization } from '~/providers'

import { PatternBackground } from '../background'
import { ImageLoader } from '../image'
import { UploadContainer } from '../upload-file'

type Props = {
  isLoading?: boolean
  wish?: Wish
  isEditable?: boolean
  onSaveImage?: (file: File | undefined) => void
  onDeleted?: (value: boolean) => void
}

export const WishImageContainer = (props: Props) => {
  const { isLoading, wish, isEditable, onSaveImage, onDeleted } = props
  const { customization } = useCustomization()

  const [imageSrc, setImageSrc] = useState<string | undefined | null>(wish?.imageUrl)

  const handleUpdateImageSrc = (value?: string) => {
    onDeleted?.(!value)
    setImageSrc(value)
  }

  const handleSaveWishImage = useCallback(
    async (file: File | undefined) => {
      onSaveImage?.(file)

      return
    },
    [onSaveImage],
  )

  return (
    <UploadContainer
      enabled={isEditable}
      onUpdateImageSrc={handleUpdateImageSrc}
      onRevert={() => handleUpdateImageSrc(wish?.imageUrl)}
      onSave={handleSaveWishImage}
      isDeletable={!!imageSrc}
      isLoading={isLoading}
      editProps={{
        className: 'm-2',
      }}
      uploadLabel={
        <div className="h-[200px] w-full flex justify-center items-center gap-4 relative">
          <div className="flex items-center justify-center bg-slate-500 w-full min-w-full h-[200px] hover:bg-slate-800">
            <ImageLoader
              defaultPlaceholder={
                <div className="bg-gray-200 dark:bg-slate-400 w-full h-[200px] flex items-center justify-center">
                  <p>Изображение не установлено</p>
                </div>
              }
              src={imageSrc || ''}
              isLoading={isLoading}
              className="bg-gray-200 dark:bg-slate-400 object-contain w-full h-[200px]"
              alt={`Wish Image of ${wish?.name || 'Без названия'}`}
            />
            <PatternBackground patternName={customization?.patternName} className="absolute" />
          </div>
          <div className="flex gap-2 items-center max-w-[360px] absolute bg-gray-200 dark:bg-slate-400 opacity-[0.9] p-2 rounded-lg z-[1]">
            <UploadEmoji className="text-3xl" />
            <p>Загрузите одно изображение в формате (jpeg/png/webp/heic) не больше 20mb</p>
          </div>
        </div>
      }
    >
      <ImageLoader
        defaultPlaceholder={
          <div className="bg-gray-200 dark:bg-slate-400 w-full w-full h-[200px] flex items-center justify-center">
            <p className="text-slate-900 dark:text-white z-[1]">Изображение не установлено</p>
            <PatternBackground patternName={customization?.patternName} className="absolute" />
          </div>
        }
        src={imageSrc || ''}
        isLoading={isLoading}
        className="bg-gray-200 dark:bg-slate-400 object-contain w-full w-full h-[200px]"
        alt={`Wish Image of ${wish?.name || 'Без названия'}`}
      />
    </UploadContainer>
  )
}
