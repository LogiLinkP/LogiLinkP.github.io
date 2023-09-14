# etapa 1: instalar dependencias y compilar la app
FROM node:18 as build
WORKDIR /app
COPY package*.json /app
RUN npm ci
COPY . .
RUN npm run build

# etapa 2: servir la app con nginx
FROM nginx:alpine
ADD ./config/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /var/www/app/
COPY ./certs/cert1.pem /etc/ssl/certs/cert1.pem
COPY ./certs/privkey1.pem /etc/ssl/certs/privkey1.pem
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]