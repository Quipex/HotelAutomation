FROM node:17.3.0-alpine as build_common
WORKDIR /HotelCommon
COPY ./HotelCommon/package.json ./HotelCommon/package-lock.json /HotelCommon/
RUN npm install --production
COPY ./HotelCommon /HotelCommon
RUN npm run build
WORKDIR /HotelAdapter
COPY ./HotelAdapter/package.json ./HotelAdapter/package-lock.json /HotelAdapter/
RUN npm install --production
COPY ./HotelAdapter /HotelAdapter
RUN npm run build
CMD ["node", "src/index.js"]
