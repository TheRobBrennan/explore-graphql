FROM node:12-alpine

# Create the app directory
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install --silent

# Copy application code
COPY . ./
RUN chmod +x ./scripts/wait-for.sh
