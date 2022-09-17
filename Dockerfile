FROM node:18.7.0 as build

WORKDIR /app
COPY package*.json .
RUN yarn install
COPY . .
RUN yarn build

FROM node:18.7.0 as build
WORKDIR /app
COPY package.json .
RUN yarn install --production
COPY --from=build /app/dist ./dist
CMD yarn prod
