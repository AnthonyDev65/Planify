# Dockerfile para Planify - Multi-stage build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Build del frontend
RUN npm run build

# Etapa de producción
FROM node:20-alpine

WORKDIR /app

# Instalar solo dependencias de producción
COPY package*.json ./
RUN npm ci --only=production

# Copiar el build del frontend
COPY --from=builder /app/dist ./dist

# Copiar el servidor
COPY server ./server

# Crear directorio para la base de datos
RUN mkdir -p /app/data

# Exponer puerto
EXPOSE 3001

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3001

# Comando de inicio
CMD ["node", "server/index.js"]
