# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
ARG VUE_APP_BASE_URL
ENV VUE_APP_BASE_URL=$VUE_APP_BASE_URL
ARG VUE_APP_API_URL
ENV VUE_APP_API_URL=$VUE_APP_API_URL
ARG VUE_APP_GRAPHQL_URL
ENV VUE_APP_GRAPHQL_URL=$VUE_APP_GRAPHQL_URL
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
