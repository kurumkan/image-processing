from node:alpine

WORKDIR /app
copy package.json .
RUN npm install  --legacy-peer-deps
COPY . .

CMD ["npm", "run", "dev"]
