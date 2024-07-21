import { QueryClient, QueryClientProvider } from 'react-query'
import { RouterProvider } from 'react-router-dom'

import { router } from '~/router'

import style from './app.module.css'
import { AuthProvider, CustomizationProvider, LayoutProvider, NotifyProvider } from './providers'
import { cn } from './utils'

const queryClient = new QueryClient()

type Props = {
  isDark: boolean
}

function App(props: Props) {
  return (
    <div className={cn(style['app'], { dark: props.isDark, 'dark-container': props.isDark })}>
      <div className={cn(style['app'], 'bg-[var(--tg-theme-bg-color)]')}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CustomizationProvider>
              <NotifyProvider>
                <LayoutProvider>
                  <RouterProvider router={router} />
                </LayoutProvider>
              </NotifyProvider>
            </CustomizationProvider>
          </AuthProvider>
        </QueryClientProvider>
      </div>
    </div>
  )
}

export default App
