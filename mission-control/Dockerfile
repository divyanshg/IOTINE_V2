FROM node:9-slim
WORKDIR /mission-control
COPY package.json /mission-control
RUN npm install
COPY . /mission-control
CMD ["npm", "start"]  