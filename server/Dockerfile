# Dockerfile for Node.js/Express server
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]
