import borwserImageCompression from 'browser-image-compression'
import heic2any from 'heic2any'
import { InputHTMLAttributes, ReactNode, useCallback, useState } from 'react'
import { DropzoneOptions, FileRejection, useDropzone } from 'react-dropzone'

import { useNotifyContext } from '~/providers'
import { cn } from '~/utils'

import { listDefaultImageExt } from './constants'
import { getDropzoneAccept } from './helpers'
import { FileUploadReqeust } from './types'

const defaultAccept = getDropzoneAccept(listDefaultImageExt)

export type UploadFileProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'accept'> &
  Pick<DropzoneOptions, 'maxSize' | 'accept' | 'maxFiles'> & {
    filename?: string
    isEditable?: boolean
    isUploadEnabled?: boolean
    dataTestid?: string
    label?: ReactNode
    className?: string
    hasError?: boolean
    hint?: string
    onUpload?: (props: FileUploadReqeust) => void
    type?: 'square' | 'input'
    showNotify?: boolean
    onLoading?: (state: boolean) => void
  }

export const UploadFileZone = (props: UploadFileProps) => {
  const {
    dataTestid,
    isUploadEnabled = true,
    label,
    className,
    accept = defaultAccept,
    maxSize,
    multiple,
    maxFiles = 1,
    onUpload,
    showNotify = false,
    hasError,
    onLoading,
  } = props
  const [isError, setError] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const { setNotify } = useNotifyContext()

  const handleLoading = useCallback(
    (state: boolean) => {
      setLoading(state)
      onLoading?.(state)
    },
    [onLoading],
  )

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setError(false)
      handleLoading(true)

      const formattedAccetpedFiles: File[] = []

      for await (const file of acceptedFiles) {
        let workedFile = file

        if (file.type === 'image/heic') {
          const convertedBlob = await heic2any({ blob: workedFile })

          const basename = (workedFile?.name || 'test-name.heic')?.split?.('/')?.pop?.()?.split('.').shift()
          const convertedFile = new File([convertedBlob as Blob], `${basename}.jpeg`, {
            type: 'image/jpeg',
          })

          workedFile = convertedFile
        }

        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        }

        try {
          const compressedFile = await borwserImageCompression(workedFile, options)

          formattedAccetpedFiles.push(compressedFile)
        } catch (error) {
          setNotify('К сожалению произошла ошибка при сжатии файла, попробуйте другой файл', { severity: 'error' })
        }
      }

      const isFileLargeError = fileRejections?.find((file) =>
        file.errors?.find((error) => error.code === 'file-too-large'),
      )

      const isFileTypeError = fileRejections?.find((file) =>
        file.errors?.find((error) => error.code === 'file-invalid-type'),
      )

      const isFileCountError = fileRejections?.find((file) =>
        file.errors?.find((error) => error.code === 'too-many-files'),
      )

      const errorLarge = isFileLargeError ? ', у файла слишком большой вес' : ''
      const errorFormat = isFileTypeError ? ', не поддерживаемый формат файла' : ''
      const errorFileCount = isFileCountError ? ', передано слишком много файлов' : ''

      const error = errorLarge || errorFormat || errorFileCount

      if (!acceptedFiles.length && showNotify) {
        setError(true)
        setNotify(`К сожалению произошла ошибка загрузки${error}`, { severity: 'error' })
      }

      if (acceptedFiles.length && fileRejections.length && showNotify) {
        setNotify(`Загружена лишь часть файлов${error}`, { severity: 'warning' })
      }

      if (acceptedFiles.length && !fileRejections.length && showNotify) {
        console.info('Загрузка прошла успешно', { severity: 'success' })
      }

      onUpload?.({ acceptedFiles: formattedAccetpedFiles, fileRejections })
      handleLoading(false)
    },
    [onUpload, showNotify, setNotify, handleLoading],
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles,
    accept,
    multiple,
    maxSize,
    disabled: !isUploadEnabled || isLoading,
  })

  return (
    <section
      data-testid={dataTestid}
      className={cn(
        'flex rounded-lg',
        {
          'cursor-no-drop': !isUploadEnabled,
          'cursor-pointer': isUploadEnabled,
        },
        className,
      )}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <div className={cn('flex justify-center flex-col w-full')}>
        <div className={cn('flex w-full')}>
          <div
            className={cn('w-full', {
              '!text-red': hasError || isError,
            })}
          >
            {label}
          </div>
        </div>
      </div>
    </section>
  )
}
