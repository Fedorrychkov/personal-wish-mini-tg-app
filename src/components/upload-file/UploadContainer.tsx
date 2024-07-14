import { ReactNode, useCallback, useEffect, useState } from 'react'

import { CloseEmoji, DeleteEmoji, EditEmoji, RevertEmoji, SaveEmoji } from '~/assets'
import { cn } from '~/utils'

import { Spinner } from '../loaders'
import { IMG_MAX_20MB_SIZE_IN_BYTE } from './constants'
import { FileUploadReqeust } from './types'
import { UploadFileZone } from './UploadFileZone'

type Props = {
  children: ReactNode
  onUpdateImageSrc?: (src: string) => void
  onRevert?: () => void
  onToggleEditable?: (state: boolean) => void
  enabled?: boolean
  editProps?: {
    className?: string
  }
  onSave?: (file: File | undefined) => Promise<void>
  uploadLabel?: ReactNode
  isLoading?: boolean
  isDeletable?: boolean
  defaultIsEditable?: boolean
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
    defaultIsEditable = false,
    onToggleEditable,
  } = props
  const [isEditable, setEditable] = useState(defaultIsEditable)
  const [draftImage, setDraftImage] = useState<File | undefined>()
  const [draftDataSrc, setDraftDataSrc] = useState<string | undefined>()
  const [isRemoved, setRemoved] = useState(false)
  const [isError, setError] = useState(false)
  const [isLoadingDropzone, setLoadingDropzone] = useState(false)
  const isLoadingState = isLoadingDropzone || isLoading

  const isEditedSrc = !!draftDataSrc || isRemoved

  const handleToggleEditable = useCallback(
    (state: boolean) => {
      onToggleEditable?.(state)
      setEditable(state)
    },
    [onToggleEditable],
  )

  useEffect(() => {
    const reader = new FileReader()

    if (draftImage) {
      reader.onload = function () {
        const result = reader.result as string
        setDraftDataSrc(result || '')
        onUpdateImageSrc?.(result || '')
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
    handleToggleEditable(!isEditable)
  }, [enabled, handleReject, handleToggleEditable, isEditable])

  const handleSaveEdited = useCallback(async () => {
    try {
      await onSave?.(draftImage)
      setRemoved(false)
      handleToggleEditable(!isEditable)
    } catch (error) {
      setError(true)
    }
  }, [onSave, draftImage, isEditable, handleToggleEditable])

  useEffect(() => {
    if (!enabled) {
      handleReject()
      handleToggleEditable(false)
    }
  }, [enabled, handleReject, handleToggleEditable])

  return (
    <div className="relative">
      {isEditable ? (
        <div>
          <UploadFileZone
            maxSize={IMG_MAX_20MB_SIZE_IN_BYTE}
            label={uploadLabel}
            onUpload={handleUpload}
            className="hover:opacity-[0.8]"
            hasError={isError}
            showNotify
            onLoading={setLoadingDropzone}
          />
          <div className={cn('flex absolute right-0 top-0 gap-2', editProps?.className)}>
            {isLoadingState ? (
              <Spinner className="!w-[24px] !h-[24px]" />
            ) : (
              <>
                {isEditedSrc && (
                  <>
                    <button
                      type="button"
                      disabled={isLoadingState}
                      className="border-none bg-slate-200 dark:bg-slate-300 rounded-[50%] w-[40px] h-[40px] hover:opacity-[0.8]"
                      title="Отменить новое изображение"
                      onClick={handleReject}
                    >
                      <RevertEmoji />
                    </button>
                    <button
                      type="button"
                      disabled={isLoadingState}
                      className="'border-none bg-slate-200 dark:bg-slate-300 rounded-[50%] w-[40px] h-[40px] hover:opacity-[0.8]"
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
                    disabled={isLoadingState}
                    className="border-none bg-slate-200 dark:bg-slate-300 rounded-[50%] w-[40px] h-[40px] hover:opacity-[0.8]"
                    title="Удалить текущее изображение"
                    onClick={handleRemove}
                  >
                    <DeleteEmoji />
                  </button>
                )}
                <button
                  type="button"
                  disabled={isLoadingState}
                  className="border-none bg-slate-200 dark:bg-slate-300 rounded-[50%] w-[40px] h-[40px] hover:opacity-[0.8]"
                  title="Отменить редактирование"
                  onClick={handleSwitchEditableMode}
                >
                  <CloseEmoji />
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          {children}
          {enabled && (
            <button
              type="button"
              disabled={isLoadingState}
              className={cn(
                'border-none absolute right-0 top-0 bg-slate-200 dark:bg-slate-400 rounded-[50%] w-[40px] h-[40px] hover:opacity-[0.8]',
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
