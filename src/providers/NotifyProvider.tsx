import { Snackbar } from '@mui/material'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import React, { createContext, useContext, useState } from 'react'

type ContextType = {
  setNotify: (message?: string, props?: AlertProps) => void
}

const NotifyContext = createContext<ContextType>({
  setNotify: () => {},
})

export const useNotifyContext = () => {
  const context = useContext(NotifyContext)

  if (!context) throw new Error('useNotifyContext must be used within a NotifyProvider')

  return context
}

type Props = {
  children?: React.ReactNode
}
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export const NotifyProvider: React.FC<Props> = ({ children }) => {
  const [options, setOptions] = useState<AlertProps | null>()
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')

  const setNotify = (message?: string, props?: AlertProps) => {
    setIsOpen(true)
    setOptions(props)
    setMessage(message || '')
  }

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setIsOpen(false)
    setOptions(null)
    setMessage('')
  }

  return (
    <NotifyContext.Provider value={{ setNotify }}>
      {children}
      <Snackbar open={isOpen} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} {...options}>
          {options?.children || message}
        </Alert>
      </Snackbar>
    </NotifyContext.Provider>
  )
}
