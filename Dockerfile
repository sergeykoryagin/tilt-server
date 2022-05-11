FROM node:16-alpine as development
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn run build

FROM node:16-alpine as production
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --prod
COPY . .
COPY --from=development /app/dist ./dist
CMD ["node", "dist/main"]
