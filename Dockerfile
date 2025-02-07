###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:22 AS development

WORKDIR /home/node/pam

# Install certificates and required packages
RUN apt-get update && \
    apt-get install -y ca-certificates openssl && \
    npm config set strict-ssl false

# Install global dependencies
RUN npm install -g @nestjs/cli prisma @prisma/client npm

# Copy necessary files with proper permissions
COPY --chown=node:node package*.json ./
COPY --chown=node:node .env ./
COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node . .

# Install dependencies
RUN npm install

# Set ownership of all files to node
RUN chown -R node:node /home/node/pam
RUN chmod -R 755 /home/node/pam/dist

RUN npx prisma generate

USER node

EXPOSE 3000

CMD ["npm", "run", "start:dev"]