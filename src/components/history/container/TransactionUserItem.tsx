import { Avatar } from '@mui/material'

import { useUserDataQuery } from '~/query'

type Props = {
  userId?: string
  showMeta?: boolean
}

export const TransactionUserItem = ({ userId, showMeta = false }: Props) => {
  const { data: user } = useUserDataQuery(userId || '', userId || '', !!userId)

  const name = user?.username || user?.firstName || user?.lastName || user?.id

  return (
    <>
      <Avatar alt={name} src={user?.avatarUrl || ''} sx={{ width: 24, height: 24 }} />
      {showMeta && <p className="text-sm text-slate-900 dark:text-white">{name}</p>}
    </>
  )
}
