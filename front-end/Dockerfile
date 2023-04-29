# Stage 1: Build the React application
FROM node:14.17-alpine as build
LABEL version="1.0" Author="taivox"
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install sweetalert2
COPY . .
RUN npm run build

# Stage 2: Serve the React application using Nginx
FROM nginx:1.21-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
