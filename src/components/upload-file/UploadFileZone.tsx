import cn from 'classnames'
import { InputHTMLAttributes, ReactNode, useCallback, useState } from 'react'
import { DropzoneOptions, FileRejection, useDropzone } from 'react-dropzone'

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
  } = props
  const [isError, setError] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setError(false)

      if (!acceptedFiles.length && showNotify) {
        setError(true)
        console.info('К сожалению произошла ошибка загрузки', { severity: 'error' })
      }

      if (acceptedFiles.length && fileRejections.length && showNotify) {
        console.info('Загружена лишь часть файлов', { severity: 'warning' })
      }

      if (acceptedFiles.length && !fileRejections.length && showNotify) {
        console.info('Загрузка прошла успешно', { severity: 'success' })
      }

      onUpload?.({ acceptedFiles, fileRejections })
    },
    [onUpload, showNotify],
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles,
    accept,
    multiple,
    maxSize,
    disabled: !isUploadEnabled,
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
