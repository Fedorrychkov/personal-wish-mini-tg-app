# Stage 1: Build the application
FROM node:18-alpine as build
WORKDIR /app
COPY . /app
COPY . ./
COPY package*.json ./
RUN npm install --legacy-peer-deps
RUN npm run build

# Stage 2: Build nginx
FROM nginx:1.21-alpine
# Копирование конфигурации Nginx
COPY ./config/prod/nginx.conf /etc/nginx/nginx.conf
# Копирование SSL сертификатов
COPY ./certificate.crt /etc/nginx/certs/
COPY ./private.key /etc/nginx/certs/

COPY --from=build /app/dist /var/www/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
