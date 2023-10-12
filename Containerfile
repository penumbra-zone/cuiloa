FROM docker.io/library/node:20-alpine

RUN mkdir -p /home/app/ && chown -R node:node /home/app
WORKDIR /home/app
RUN npm install -g pnpm
COPY --chown=node:node . .

USER node

RUN pnpm install
RUN pnpm build

EXPOSE 3000
CMD [ "pnpm", "dev" ]

