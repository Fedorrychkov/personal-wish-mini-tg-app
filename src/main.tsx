import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './index.css'

import { initMiniApp } from '@tma.js/sdk'
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './app'

const [miniApp] = initMiniApp()

miniApp.ready()

miniApp.setHeaderColor('secondary_bg_color')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
