import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { RouterProvider } from 'react-router-dom'

import { router } from '~/router'

import style from './app.module.css'
import { YANDEX_METRICA_ID } from './config'
import {
  AuthProvider,
  CustomizationProvider,
  LayoutProvider,
  NotifyProvider,
  OnboardingContainerProvider,
} from './providers'
import { cn } from './utils'

const queryClient = new QueryClient()

type Props = {
  isDark: boolean
}

function App(props: Props) {
  useEffect(() => {
    // Инициализация Я.Метрики
    const initYM = () => {
      try {
        // @ts-expect-error error
        window.ym =
          // @ts-expect-error error
          window.ym ||
          function () {
            // @ts-expect-error error
            // eslint-disable-next-line prefer-rest-params
            ;(window.ym.a = window.ym.a || []).push(arguments)
          }
        // @ts-expect-error error
        window.ym.l = 1 * new Date()

        // @ts-expect-error error
        ym(YANDEX_METRICA_ID, 'init', {
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
          triggerEvent: true, // Важно для отслеживания событий
        })
      } catch (e) {
        console.error('YM init error:', e)
      }
    }

    if (YANDEX_METRICA_ID) {
      // Загрузка скрипта Метрики
      const script = document.createElement('script')
      script.src = 'https://mc.yandex.ru/metrika/tag.js'
      script.async = true
      script.onload = initYM
      document.head.appendChild(script)
    }
  }, [])

  return (
    <div className={cn(style['app'], { dark: props.isDark, 'dark-container': props.isDark })}>
      <div className={cn(style['app'], 'bg-[var(--tg-theme-bg-color)]')}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CustomizationProvider>
              <NotifyProvider>
                <LayoutProvider>
                  <OnboardingContainerProvider>
                    <RouterProvider router={router} />
                  </OnboardingContainerProvider>
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
