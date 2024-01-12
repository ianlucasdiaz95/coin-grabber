FROM node:18-alpine 

WORKDIR /app

ENV REDIS_HOST=redis_db
ENV PORT=3000

COPY package*.json ./ 

COPY . . 

RUN npm install 

EXPOSE 3000 

CMD ["npm", "run", "start"]