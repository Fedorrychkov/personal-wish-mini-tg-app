import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'

const aliases = [
  'components',
  'utils',
  'query',
  'router',
  'layouts',
  'pages',
  'providers',
  'entities',
  'hooks',
  'services',
  'config',
]

const isProduction = process.env.NODE_ENV === 'production'

const server = isProduction
  ? {}
  : {
      // port: 3000,
      port: 443,
      host: '0.0.0.0',
      hmr: {
        host: 'tg-mini-app.local',
        port: 443,
      },
      https: {
        key: fs.readFileSync('./.cert/localhost-key.pem'),
        cert: fs.readFileSync('./.cert/localhost.pem'),
      },
    }
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server,
  resolve: {
    alias: aliases.map((alias) => ({
      find: `~/${alias}`,
      replacement: path.resolve(__dirname, `src/${alias}`),
    })),
  },
  build: {
    outDir: './dist',
  },
  base: '/',
})
