# 1) Install dependencies only when needed
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm install --frozen-lockfile

# 2) Build & export static site, compile TS listener
FROM node:18-alpine AS builder
WORKDIR /app

# copy source + installed modules
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# 2a) Build and export Next.js to /app/out
RUN npm run build:next

# 2b) Compile your serverAgentListener.ts to JS
RUN npm run build:serveragent

# 3) Final, production image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 3a) Copy over the static export
COPY --from=builder /app/out       ./out

# 3b) Copy compiled listener (or TS source if you prefer ts-node)
COPY --from=builder /app/dist      ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json  ./package.json

EXPOSE 3000

# 4) Serve static site & start your agent listener in parallel
CMD ["npm", "start"]
