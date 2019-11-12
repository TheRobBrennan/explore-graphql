FROM node:12.13.0

# Install Chrome for Protractor tests
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -yq google-chrome-stable

# Create the app directory
WORKDIR /app

# Add the Angular CLI
RUN npm install -g @angular/cli

# Install dependencies
COPY package.json ./
RUN npm install

# Copy application code
COPY . ./

# Expose our application port
EXPOSE 4200
EXPOSE 9876
