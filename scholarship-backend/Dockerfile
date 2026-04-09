FROM node:18-alpine

WORKDIR /app

# Install dependencies first for layer caching
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Expose port (default 5000 according to app)
EXPOSE 5000

CMD ["npm", "start"]
