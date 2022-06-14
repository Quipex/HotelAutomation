FROM node:17.3.1-alpine as common
WORKDIR /HotelCommon
COPY ./HotelCommon/package.json ./HotelCommon/package-lock.json ./
RUN yarn install --production
COPY ./HotelCommon ./
RUN yarn run build

FROM node:17.3.1-alpine as app
WORKDIR /HotelCommon
COPY --from=build_common / ./dist
WORKDIR /HotelAdapter
COPY ./HotelAdapter/package.json ./HotelAdapter/package-lock.json ./
RUN yarn install --production
COPY ./HotelAdapter ./
RUN yarn run build
RUN mkdir logs
RUN mkdir logs/app
RUN mkdir logs/background
RUN mkdir logs/tests
RUN mkdir logs/users

CMD ["node", "src/index.js"]
