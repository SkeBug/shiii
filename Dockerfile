###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:22.13.0 AS development

WORKDIR /home/node/aopam

# Install certificates and required packages
RUN apt-get update && \
    apt-get install -y ca-certificates openssl && \
    rm -rf /var/lib/apt/lists/* && \
    npm config set strict-ssl false

COPY --chown=node:node package*.json ./
COPY --chown=node:node tsconfig.json ./

RUN npm i -g @nestjs/cli && \
    npm i prisma -D --save-exact --save-dev && \
    npm ci

COPY --chown=node:node . .

COPY .env .env

# RUN npx prisma generate --schema=./src/database/prisma/schema.prisma || \
#     (rm -rf /root/.cache/prisma && npx prisma generate --schema=./src/database/prisma/schema.prisma)

USER node

EXPOSE 3000

CMD ["npm", "run", "start:dev"]