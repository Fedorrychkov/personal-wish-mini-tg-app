import { Skeleton } from '@mui/material'

export const CategoryFormSkeleton = () => (
  <div className="gap-4 flex flex-col">
    <Skeleton className="rounded-lg pb-4" variant="rectangular" width={'100%'} height={154} />
    <Skeleton className="rounded-lg" variant="rectangular" width={'100%'} height={40} />
    <div className="flex items-center">
      <div className="flex w-[58px] h-[24px]">
        <Skeleton className="rounded-lg mr-[12px]" variant="rectangular" width={'100%'} height={24} />
      </div>
      <Skeleton className="rounded-lg" variant="rectangular" width={100} height={24} />
    </div>
    <div className="w-full h-[1px] bg-gray-400 mt-4" />
    <div className="gap-4 mt-2 flex justify-between">
      <Skeleton className="rounded-lg" variant="rectangular" width={100} height={31} />

      <Skeleton className="rounded-lg" variant="rectangular" width={100} height={31} />
    </div>
  </div>
)
