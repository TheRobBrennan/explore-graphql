FROM mhart/alpine-node:10

# Add the bash shell
RUN apk add --update bash && rm -rf /var/cache/apk/*

# Create the app directory
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy application code
COPY . ./
RUN chmod +x ./scripts/wait-for.sh

# Expose our application and node debugger ports
EXPOSE 4000
EXPOSE 9229
