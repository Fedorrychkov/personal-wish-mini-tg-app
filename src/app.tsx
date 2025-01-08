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

      <script
        id="yandex-metrika"
        dangerouslySetInnerHTML={{
          __html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();
   for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
   k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(${YANDEX_METRICA_ID}, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
   });`,
        }}
      />
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${YANDEX_METRICA_ID}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </div>
  )
}

export default App
