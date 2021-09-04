FROM node:alpine as ts-compiler

WORKDIR /app
COPY package.json .
COPY tsconfig*.json .
RUN npm install --only=prod  --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:alpine as ts-remover
WORKDIR /app
COPY --from=ts-compiler /app/package*.json ./
COPY --from=ts-compiler /app/build ./
RUN npm install --only=production


FROM node:alpine
WORKDIR /app
COPY --from=ts-remover /app ./
USER 1000
CMD ["npm", "start"]


