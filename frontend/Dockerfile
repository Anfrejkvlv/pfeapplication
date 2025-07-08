# Étape 1 – Build Angular
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build --  --configuration=production

# Aucun service Nginx ici : on copie dans le dossier nginx/html/ via script externe
