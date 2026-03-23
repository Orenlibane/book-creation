FROM node:22-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
ENV PORT=3333

RUN npx prisma generate
RUN npm run build:web
RUN npm run build:api

EXPOSE 3333

CMD ["node", "dist/apps/api/main.js"]
