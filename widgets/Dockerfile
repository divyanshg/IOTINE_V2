FROM node:latest
WORKDIR /widgets
COPY package.json /widgets
RUN npm install
COPY . /widgets
CMD ["npm", "start"]  
