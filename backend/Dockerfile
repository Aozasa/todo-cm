FROM node:20-buster-slim

WORKDIR /todo-cm
RUN chown -R node:node .
USER node

COPY --chown=node:node ./package*.json ./
RUN npm i

COPY --chown=node:node ./ ./

EXPOSE 3000
CMD [ "npx", "prisma", "migrate", "dev", "&&" ,"npm", "start"]