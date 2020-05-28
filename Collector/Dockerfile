FROM node:latest
WORKDIR /Collector
COPY package.json /Collector
RUN npm install
COPY . /Collector
CMD ["npm", "start"]  