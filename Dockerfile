FROM node:14-alpine
WORKDIR /opt/app
ADD . .
RUN yarn install --prod
RUN yarn build
CMD ["yarn", "start:prod"]