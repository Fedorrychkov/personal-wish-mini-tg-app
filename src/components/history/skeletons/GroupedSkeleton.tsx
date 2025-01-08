import { Skeleton } from '@mui/material'

export const GroupedSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="rounded-lg pb-4" variant="rectangular" width={'100%'} height={20} />
      <Skeleton className="rounded-lg" variant="rectangular" width={'100%'} height={20} />
      <Skeleton className="rounded-lg" variant="rectangular" width={'100%'} height={20} />
    </div>
  )
}
