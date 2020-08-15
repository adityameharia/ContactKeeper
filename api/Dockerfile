FROM node:12.18.3
WORKDIR ./
COPY package*.json ./
RUN npm i
COPY . ./
EXPOSE 5000
CMD ["npm","start"]