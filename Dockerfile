# Utiliser une image de base officielle de Node.js
FROM node:20

# Installer pnpm
RUN npm install -g pnpm

# Créer et utiliser un répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et pnpm-lock.yaml
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Installer les dépendances de l'application
RUN pnpm install

# Copier les fichiers de l'application
COPY . .

# Exposer le port sur lequel l'application écoute
EXPOSE 3000

# Démarrer l'application
CMD [ "node", "server.js" ]
