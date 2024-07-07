import { ReactNode, useCallback, useEffect, useState } from 'react'

import { CloseEmoji, DeleteEmoji, EditEmoji, RevertEmoji, SaveEmoji } from '~/assets'
import { cn } from '~/utils'

import { IMG_MAX_1MB_SIZE_IN_BYTE } from './constants'
import { FileUploadReqeust } from './types'
import { UploadFileZone } from './UploadFileZone'

type Props = {
  children: ReactNode
  onUpdateImageSrc?: (src: string) => void
  onRevert?: () => void
  enabled?: boolean
  editProps?: {
    className?: string
  }
  onSave?: (file: File | undefined) => Promise<void>
  uploadLabel?: ReactNode
  isLoading?: boolean
  isDeletable?: boolean
}

export const UploadContainer = (props: Props) => {
  const {
    children,
    editProps,
    uploadLabel,
    enabled = true,
    onUpdateImageSrc,
    onRevert,
    onSave,
    isLoading = false,
    isDeletable = false,
  } = props
  const [isEditable, setEditable] = useState(false)
  const [draftImage, setDraftImage] = useState<File | undefined>()
  const [draftDataSrc, setDraftDataSrc] = useState<string | undefined>()
  const [isRemoved, setRemoved] = useState(false)
  const [isError, setError] = useState(false)

  const isEditedSrc = !!draftDataSrc || isRemoved

  useEffect(() => {
    const reader = new FileReader()

    if (draftImage) {
      reader.onload = function () {
        setDraftDataSrc((reader?.result as string) || '')
        onUpdateImageSrc?.((reader?.result as string) || '')
        // setValue('logoUrl', null)
      }

      reader.readAsDataURL(draftImage)
    }
  }, [draftImage, onUpdateImageSrc])

  const handleRemove = useCallback(() => {
    setDraftImage(undefined)
    setDraftDataSrc(undefined)
    onUpdateImageSrc?.('')
    setRemoved(true)
  }, [onUpdateImageSrc])

  const handleReject = useCallback(() => {
    setDraftImage(undefined)
    setDraftDataSrc(undefined)
    setRemoved(false)
    onRevert?.()
  }, [onRevert])

  const handleUpload = useCallback((values: FileUploadReqeust) => {
    const { acceptedFiles } = values

    if (acceptedFiles?.length) {
      const [file] = acceptedFiles

      setDraftImage(file)
    }
  }, [])

  const handleSwitchEditableMode = useCallback(() => {
    if (!enabled) return

    handleReject()
    setEditable((state) => !state)
  }, [enabled, handleReject])

  const handleSaveEdited = useCallback(async () => {
    try {
      await onSave?.(draftImage)
      setRemoved(false)
      setEditable((state) => !state)
    } catch (error) {
      setError(true)
    }
  }, [onSave, draftImage])

  return (
    <div className="relative">
      {isEditable ? (
        <div>
          <UploadFileZone
            maxSize={IMG_MAX_1MB_SIZE_IN_BYTE}
            label={uploadLabel}
            onUpload={handleUpload}
            className="hover:opacity-[0.8]"
            hasError={isError}
            showNotify
          />
          <div className="absolute right-0 top-0 ">
            {isEditedSrc && (
              <>
                <button
                  type="button"
                  disabled={isLoading}
                  className={cn(
                    'border-none bg-slate-200 dark:bg-slate-600 rounded-xl w-[24px] h-[24px] hover:opacity-[0.8]',
                    editProps?.className,
                  )}
                  title="Отменить новое изображение"
                  onClick={handleReject}
                >
                  <RevertEmoji />
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  className={cn(
                    'border-none bg-slate-200 dark:bg-slate-600 rounded-xl w-[24px] h-[24px] hover:opacity-[0.8]',
                    editProps?.className,
                  )}
                  title="Сохранить новое иозображение"
                  onClick={handleSaveEdited}
                >
                  <SaveEmoji />
                </button>
              </>
            )}
            {!isEditedSrc && isDeletable && (
              <button
                type="button"
                disabled={isLoading}
                className={cn(
                  'border-none bg-slate-200 dark:bg-slate-600 rounded-xl w-[24px] h-[24px] hover:opacity-[0.8]',
                  editProps?.className,
                )}
                title="Удалить текущее изображение"
                onClick={handleRemove}
              >
                <DeleteEmoji />
              </button>
            )}
            <button
              type="button"
              disabled={isLoading}
              className={cn(
                'border-none bg-slate-200 dark:bg-slate-600 rounded-xl w-[24px] h-[24px] hover:opacity-[0.8]',
                editProps?.className,
              )}
              title="Отменить редактирование"
              onClick={handleSwitchEditableMode}
            >
              <CloseEmoji />
            </button>
          </div>
        </div>
      ) : (
        <>
          {children}
          {enabled && (
            <button
              type="button"
              disabled={isLoading}
              className={cn(
                'border-none absolute right-0 top-0 bg-slate-200 dark:bg-slate-600 rounded-xl w-[24px] h-[24px] hover:opacity-[0.8]',
                editProps?.className,
              )}
              onClick={handleSwitchEditableMode}
            >
              <EditEmoji />
            </button>
          )}
        </>
      )}
    </div>
  )
}
