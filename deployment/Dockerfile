
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run compile

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000
ENV HOST=0.0.0.0

USER node

CMD ["node", "server.js"]
