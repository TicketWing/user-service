FROM node:16

RUN apt-get update \
    && apt-get install -y netcat \
    --no-install-recommends

USER node

WORKDIR /app

COPY --chown=node package.json .
COPY --chown=node package-lock.json .

RUN npm install

COPY --chown=node build/ .
COPY --chown=node migrations/scripts/migrations.sh ./migrations/scripts/

RUN chmod +x /app/migrations/scripts/migrations.sh

CMD [ "node", "src/index.js" ]