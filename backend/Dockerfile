FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create servers directory
RUN mkdir -p /app/servers

EXPOSE 8091

CMD ["node", "dist/main"]
