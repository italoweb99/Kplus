# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# instalar dependências (inclui dev para permitir build TS)
COPY package*.json ./
RUN npm ci --no-audit --prefer-offline --include=dev

COPY . .
ARG VITE_API_URL
ARG REACT_APP_API_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# rodar build (Vite -> dist ou CRA -> build)
RUN npm run build

# normaliza saída: coloca dist ou build em /app/out
RUN if [ -d ./dist ]; then mv ./dist ./out; \
    elif [ -d ./build ]; then mv ./build ./out; \
    else mkdir -p ./out; fi

# Stage final nginx
FROM nginx:stable-alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copia a saída padronizada
COPY --from=build /app/out /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]