import { useMemo } from 'react'

import { prettifyNumber, truncate } from '~/utils'

type Props = {
  value?: string | number | null
  isTruncated?: boolean
  truncateDecimals?: number
}

export const NumberFormat = ({ value, isTruncated = false, truncateDecimals = 4 }: Props) => {
  const prettierValue = useMemo(
    () => (value ? prettifyNumber(!isTruncated ? truncate(value, truncateDecimals) : value) : '0'),
    [value, isTruncated, truncateDecimals],
  )

  return <>{`${prettierValue || 0}`}</>
}
