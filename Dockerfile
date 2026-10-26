# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install --global pnpm@9.15.9 && HUSKY=0 pnpm install --frozen-lockfile
COPY . .
RUN --mount=type=secret,id=build_env,target=/app/.env npm run build

FROM nginx:stable-alpine
COPY .docker/production/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
EXPOSE 80
