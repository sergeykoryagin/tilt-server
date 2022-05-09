FROM node:14-alpine
WORKDIR /opt/app
COPY package.json .
RUN yarn install
COPY . .
RUN yarn build
CMD ["yarn", "start:prod"]
