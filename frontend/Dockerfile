# Build stage
FROM node:18-alpine AS build
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
# se usa yarn, adapte
RUN npm ci --no-audit --prefer-offline

COPY . .
ARG VITE_API_URL
ARG REACT_APP_API_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# build (Vite ou CRA)
RUN npm run build

# Production stage - nginx
FROM nginx:stable-alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copiar build: Vite => dist, CRA => build
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]