# Stage 1: Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Compile TypeScript code
RUN npm run build

# Stage 2: Runtime stage
FROM node:18-alpine

WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/dist ./dist
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Create uploads directory
RUN mkdir /tmp/uploads

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]