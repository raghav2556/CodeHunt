FROM node:22

RUN apt-get update && apt-get install -y g++

WORKDIR /app

COPY . .

RUN cd frontend && npm install
RUN cd backend && npm install

RUN cd frontend && npm run build

WORKDIR /app/backend

EXPOSE 5000

CMD ["node", "server.js"]