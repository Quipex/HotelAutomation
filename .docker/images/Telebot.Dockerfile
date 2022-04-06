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

CMD ["node", "src/index.js"]
