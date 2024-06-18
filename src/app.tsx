import { retrieveLaunchParams } from '@tma.js/sdk'
import { QueryClient, QueryClientProvider } from 'react-query'
import { RouterProvider } from 'react-router-dom'

import { AuthProvider } from '~/providers/auth'
import { router } from '~/router'

import style from './app.module.css'
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
            <RouterProvider router={router} />
          </AuthProvider>
        </QueryClientProvider>
      </div>
    </div>
  )
}

export default App
