FROM node:18-alpine AS build
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN if npm run | grep -q "build"; then npm run build || true; fi

FROM node:18-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app ./

EXPOSE 5000
USER appuser

CMD ["sh", "-c", "if npm run | grep -q \"start\"; then npm run start; elif [ -f dist/index.js ]; then node dist/index.js; elif [ -f index.js ]; then node index.js; else echo 'No start script found' && exit 1; fi"]