FROM node:22

COPY . /app
WORKDIR /app

RUN npm i -g pnpm
RUN pnpm i 
RUN pnpm run build
RUN pnpm prisma migrate deploy

EXPOSE 3000
ENTRYPOINT ["npm", "start"]