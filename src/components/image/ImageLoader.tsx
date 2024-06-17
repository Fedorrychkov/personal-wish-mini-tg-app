import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '~/utils'

import { Spinner } from '../loaders'

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  defaultPlaceholder?: ReactNode
  className?: string
  src?: string | null
}

export const ImageLoader = (props: Props) => {
  const { className, defaultPlaceholder, src, ...rest } = props || {}

  const [isMediaLoading, setIsMediaLoading] = useState(true)
  const [isMediaError, setMediaError] = useState(!src || false)

  const setMediaIsLoaded = () => setIsMediaLoading(false)

  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = imgRef.current

    /*
			If the image is cached by the browser, the 'onLoad' handler won't work.
			At the same time if the image is cached, 'img.complete' equals true.
		*/
    if (img?.complete || !src) setMediaIsLoaded()

    let timerId: any

    /**
     * If the image is not empty and not loaded, try to get it by interval
     */
    if (img && !img.complete && !isMediaLoading) {
      timerId = setInterval(() => {
        const img = imgRef.current

        if (img?.complete) {
          setMediaIsLoaded()
          clearInterval(timerId)
        }
      }, 500)
    }

    return () => timerId && clearInterval(timerId)
  }, [src, imgRef, isMediaLoading])

  const loadingMediaClassName = useMemo(() => {
    if (isMediaLoading) return 'hidden'

    return ''
  }, [isMediaLoading])

  if (isMediaError && defaultPlaceholder) {
    return <div className={cn('flex items-center justify-center', className)}>{defaultPlaceholder}</div>
  }

  return (
    <>
      {isMediaLoading && (
        <div className={cn('flex items-center justify-center', className)}>
          <Spinner />
        </div>
      )}
      <img
        src={src}
        alt="Image"
        {...rest}
        className={cn(loadingMediaClassName, className)}
        ref={imgRef}
        onLoad={setMediaIsLoaded}
        onError={() => setMediaError(true)}
      />
    </>
  )
}
