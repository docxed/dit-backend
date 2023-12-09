# Use the official Node.js image as a base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json, yarn.lock, and .env to the working directory
COPY package.json yarn.lock .env ./

# Install application dependencies using Yarn
RUN yarn install --production

# Copy the rest of the application code to the working directory
COPY . .


# Expose the port your app runs on
EXPOSE 5001

# Specify the command to run on container start
CMD ["yarn", "start"]
