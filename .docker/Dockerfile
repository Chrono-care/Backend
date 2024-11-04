FROM node:22-alpine AS base

WORKDIR /app

CMD ["sh", "/entrypoint.sh"]

FROM base AS dev
COPY ./entrypoint.sh /

FROM base AS prod
COPY ./.docker/entrypoint.sh /
COPY . /app

ENV NODE_ENV=production
