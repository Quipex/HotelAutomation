FROM node:17.3.1-alpine as common_build_ts
WORKDIR /HotelCommonTs
COPY ./HotelCommon/package*.json ./
RUN yarn install
COPY ./HotelCommon ./
RUN yarn run build

FROM node:17.3.1-alpine as common_build
WORKDIR /HotelCommon
COPY ./HotelCommon/package*.json ./
RUN yarn install --production
COPY --from=common_build_ts /HotelCommonTs/dist ./dist

FROM node:17.3.1-alpine as app_build_ts
COPY --from=common_build /HotelCommon /HotelCommon
WORKDIR /HotelAdapter
COPY ./HotelPmsAdapter/package*.json ./
RUN yarn install
COPY ./HotelPmsAdapter ./
RUN yarn run build

FROM node:17.3.1-alpine as app
COPY --from=common_build /HotelCommon /HotelCommon
WORKDIR /HotelAdapter
COPY ./HotelPmsAdapter/package*.json ./
RUN yarn install --production
COPY --from=app_build_ts /HotelAdapter/dist ./src
RUN mkdir logs
RUN mkdir logs/app
RUN mkdir logs/users
RUN mkdir logs/wip
RUN mkdir logs/db

CMD ["node", "src/index.js"]
