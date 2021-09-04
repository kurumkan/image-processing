FROM node:alpine

WORKDIR /app
COPY package.json .
COPY tsconfig.json .
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
COPY . .
USER 1000
CMD ["npm", "start"]
