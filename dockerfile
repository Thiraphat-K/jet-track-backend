FROM node:18-alpine as base
RUN npm i -g pnpm

RUN mkdir jt-backend
COPY ./.env.development /jt-backend/.env
COPY . /jt-backend
WORKDIR /jt-backend
RUN rm -rf .env.development

RUN pnpm i --frozen-lockfile
EXPOSE 8765
CMD ["pnpm", "start:dev"]