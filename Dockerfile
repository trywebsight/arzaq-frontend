FROM node:20 

# Set the working directory inside the container
WORKDIR /app

COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build
CMD ["npm", "run", "start"]
