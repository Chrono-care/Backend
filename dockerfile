# Utiliser l'image de base Node.js
FROM node:16

# Installer le client PostgreSQL
RUN apt-get update && apt-get install -y postgresql-client

# Créer et définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Commande pour démarrer le backend
CMD ["npm", "start"]
