# Paulux SPA — build then serve static via nginx.
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# VITE_* are compile-time; pass with --build-arg and forward to the build.
ARG VITE_BASE_DOMAIN
ARG VITE_API_BASE_URL
ENV VITE_BASE_DOMAIN=$VITE_BASE_DOMAIN
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
