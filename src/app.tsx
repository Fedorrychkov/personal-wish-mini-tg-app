import { retrieveLaunchParams } from '@tma.js/sdk'
import { isSupported, subscribe } from 'on-screen-keyboard-detector'
import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { RouterProvider } from 'react-router-dom'

import { router } from '~/router'

import style from './app.module.css'
import { AuthProvider, NotifyProvider } from './providers'
import { cn } from './utils'

const queryClient = new QueryClient()

function App() {
  const launchParams = retrieveLaunchParams()
  const isNighMode = launchParams.themeParams.bgColor !== '#ffffff'
  const [appendedHeight, setHeight] = useState(0)

  useEffect(() => {
    if (isSupported()) {
      const unsubscribe = subscribe((visibility) => {
        if (visibility === 'hidden') {
          setHeight(0)
        } else {
          setHeight(500)
        }
      })

      // After calling unsubscribe() the callback will no longer be invoked.
      return () => unsubscribe()
    }
  }, [])

  return (
    <div className={cn(style['app'], { dark: isNighMode })}>
      <div className={cn(style['app'], 'bg-white dark:bg-slate-800')}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <NotifyProvider>
              <RouterProvider router={router} />
            </NotifyProvider>
          </AuthProvider>
        </QueryClientProvider>
        <div style={{ height: `${appendedHeight}px` }} />
      </div>
    </div>
  )
}

export default App
