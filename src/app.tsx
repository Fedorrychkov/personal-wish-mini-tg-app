import { retrieveLaunchParams } from '@tma.js/sdk'
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
      </div>
    </div>
  )
}

export default App
