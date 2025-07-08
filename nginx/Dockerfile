# Étape 1 : Build du frontend
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copier les fichiers build Angular (html/) qui ont été préalablement copiés ici
COPY html/ ./

# Config Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

LABEL authors="Hydra DEV"